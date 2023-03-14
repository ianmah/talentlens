const GET_PROFILES = require('../../../util/queries/getProfiles');
const GET_FOLLOWERS = require('../../../util/queries/getFollowers');
const axios = require('axios');

const TALENT_API = 'https://api.talentprotocol.com/api/v1'
const headers = {
  'X-API-KEY': process.env.TALENT_API_KEY
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(400).json({ message: "Bad request" })
  }

  const handle = req.query.handle
  const profileId = req.query.profileId

  if (profileId) {
    const lensFollowers = await getLensFollowers(profileId)

    const lensWallets = {}
    lensFollowers.forEach(connection => {
      lensWallets[connection.wallet.address.toLowerCase()] = {
        lensHandle: connection.wallet.defaultProfile.handle,
        profile_picture_url: connection.wallet.defaultProfile.picture?.original?.url,
        name: connection.wallet.defaultProfile.name,
      }
    })

    const talentProfilesFromLensWallets = await axios({
      method: 'GET',
      url: `${TALENT_API}/talents`,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.TALENT_API_KEY
      },
      data: { ids: Object.keys(lensWallets) }
    })
    talentProfilesFromLensWallets.data.talents.forEach(profile => {
      lensWallets[profile.wallet_address] = {
        ...lensWallets[profile.wallet_address],
        username: profile.username,
      }
    })
    return res.status(200).json(Object.values(lensWallets))
  }

  try {
    const mutualFollows = await axios.get(`${TALENT_API}/connections?id=${handle}&connection_type=mutual_follow`, { headers })
    const followers = await axios.get(`${TALENT_API}/connections?id=${handle}&connection_type=following`, { headers })

    const walletMap = {}

    const connections = [...mutualFollows.data.connections, ...followers.data.connections]

    connections.forEach(connection => {
      if (!connection.wallet_address) {
        connection.wallet_address = '0x0000000000000000000000000000000000000000'
      }
      walletMap[connection.wallet_address.toLowerCase()] = connection
    })

    const walletLensProfiles = await getLensProfiles(walletMap)


    return res.status(200).json(Object.values(walletLensProfiles))
  } catch (e) {
    console.log(e)
    return res.status(404).json({ message: "Not found" })
  }
}

async function getLensFollowers(profileId) {
  if (!profileId) {
    console.log('No lens profile given')
    return {}
  }
  try {
    const res = await axios({
      method: 'POST',
      url: `https://api.lens.dev/`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        query: GET_FOLLOWERS.default,
        variables: {
          request: {
            profileId,
            limit: 50,
          },
        }
      })
    })
    return res.data.data.followers.items
  } catch (e) {
    console.log('Error getting Lens followers', e)
    return {}
  }
}

async function getLensProfiles(walletMap) {
  if (!Object.keys(walletMap).length) {
    return {}
  }

  try {
    const res = await axios({
      method: 'POST',
      url: `https://api.lens.dev/`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        query: GET_PROFILES.default,
        variables: {
          request: {
            ownedBy: Object.keys(walletMap),
            limit: 10,
          },
        }
      })

    })
    try {
      const profiles = res.data.data.profiles.items

      profiles.forEach(profile => {
        walletMap[profile.ownedBy.toLowerCase()] = {
          ...walletMap[profile.ownedBy.toLowerCase()],
          lensHandle: profile.handle
        }
      })

      return walletMap
    } catch (e) {
      console.warn('error parsing results', e)
      return {}
    }
  } catch (e) {
    console.warn('lenserr ', e.message)
    return {}
  }
}

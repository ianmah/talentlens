const GET_PROFILES = require('../../../util/queries/getProfiles');
const GET_FOLLOWING = require('../../../util/queries/getFollowing');
const axios = require('axios');

const TALENT_API = 'https://api.talentprotocol.com/api/v1'
const headers = {
  'X-API-KEY': process.env.TALENT_API_KEY
}

function sortConnections (x, y) {
  if (x.lensHandle && x.username) {
    return -1;
  }
  if (y.lensHandle && y.username) {
    return 1;
  }
  if (x.lensHandle && !y.lensHandle) {
      return -1;
  }
  if (!x.lensHandle && y.lensHandle) {
      return 1;
  }
  return 0;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Bad request" })
  }

  const handle = req.query.handle
  const lensWallets = {}

  const lensFollowers = req.body.lensFollowing || []

  if (lensFollowers.length) {
    lensFollowers.forEach(connection => {
      const profile_picture_url = connection.profile.picture?.original?.url
                                    .replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')
                                    || 'https://beta.talentprotocol.com/packs/media/images/648f6f70811618825dc9.png'
      lensWallets[connection.profile.ownedBy.toLowerCase()] = {
        lensHandle: connection.profile.handle,
        lensId: connection.profile.id,
        profile_picture_url,
        name: connection.profile.name,
        isFollowedByMe: connection.profile.isFollowedByMe,
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
  }

  try {
    const followers = await axios.get(`${TALENT_API}/subscribing?id=${handle}`, { headers })
    console.log(followers.data)

    const walletMap = {}

    const connections = [...followers.data.subscribing]

    connections.forEach(connection => {
      if (!connection.wallet_address || connection.wallet_address == null) {
        connection.wallet_address = '0x0000000000000000000000000000000000000000'
      }
      walletMap[connection.wallet_address.toLowerCase()] = connection
    })
    
    const profiles = {...walletMap, ...lensWallets}

    return res.status(200).json({profiles, cursor: followers.data.pagination})
  } catch (e) {
    console.log(e)
    return res.status(404).json({ message: "Not found" })
  }
}

async function getLensFollowing(address) {
  if (!address) {
    console.log('No address given')
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
        query: GET_FOLLOWING.default,
        variables: {
          request: {
            address,
            limit: 50,
          },
        }
      })
    })
    return res.data.data.following.items
  } catch (e) {
    console.log('Error getting Lens following', e)
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
          lensHandle: profile.handle,
          lensId: profile.id,
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

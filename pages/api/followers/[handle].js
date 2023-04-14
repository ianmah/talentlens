const GET_PROFILES = require('../../../util/queries/getProfiles');
const GET_FOLLOWERS = require('../../../util/queries/getFollowers');
const axios = require('axios');

const TALENT_API = 'https://api.talentprotocol.com/api/v1'
const headers = {
  'X-API-KEY': process.env.TALENT_API_KEY
}

function sortConnections (x, y) {
  if (x[1].lensHandle && x[1].username) {
    return -1;
  }
  if (y[1].lensHandle && y[1].username) {
    return 1;
  }
  if (x[1].lensHandle && !y[1].lensHandle) {
      return -1;
  }
  if (!x[1].lensHandle && y[1].lensHandle) {
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

  const lensFollowers = req.body.lensFollowers || []

  if (lensFollowers.length) {
      
    lensFollowers.forEach(connection => {
      const profile_picture_url = connection.wallet.defaultProfile.picture?.original?.url
                                    .replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')
                                    || 'https://beta.talentprotocol.com/packs/media/images/648f6f70811618825dc9.png'
      lensWallets[connection.wallet.address.toLowerCase()] = {
        lensHandle: connection.wallet.defaultProfile.handle,
        lensId: connection.wallet.defaultProfile.id,
        profile_picture_url,
        name: connection.wallet.defaultProfile.name,
        isFollowedByMe: connection.wallet.defaultProfile.isFollowedByMe,
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
    const cursor = req.body.talCursor ? `&cursor=${req.body.talCursor}` : ''
    const followers = await axios.get(`${TALENT_API}/subscribers?id=${handle}${cursor}`, { headers })

    const walletMap = {}

    const connections = [...followers.data.subscribers]

    connections.forEach(connection => {
      if (!connection.wallet_address) {
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

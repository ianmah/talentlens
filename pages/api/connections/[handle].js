const GET_PROFILES = require('../../../util/queries/getProfiles');
const axios = require('axios');

const TALENT_API = 'https://api.talentprotocol.com/api/v1'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Cache-Control', 'no-cache')

  if (req.method !== "GET") {
    return res.status(400).json({ message: "Bad request" })
  }
  const handle = req.query.handle
  const type = req.query.type

  if (!type) {
    return res.status(400).json({ message: "Include a type (follower/following)" })
  }

  try {
    // const talentreq = await axios.get(`${TALENT_API}/connections?id=${handle}&connection_type=${type}`,
    const talentreq = await axios.get(`${TALENT_API}/followers?id=${handle}`,
      {
        headers: {
          'X-API-KEY': process.env.TALENT_API_KEY
        }
      })

    const wallets = getWallets(talentreq.data)
    await getLensProfiles(wallets)

    return res.status(200).json(talentreq.data)
  } catch (e) {
    console.log(JSON.stringify(e.response.data))
    return res.status(404).json({ message: "Not found" })
  }
}

function getWallets(data) {
  const connections = data.followers

  const wallets = connections.map(connection => {
    return connection.wallet_address
  })
  return wallets
}

async function getLensProfiles(wallets) {
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
          ownedBy: wallets,
          limit: 10,
        },
      }
    })
    
  })
  console.log(res.data)
}

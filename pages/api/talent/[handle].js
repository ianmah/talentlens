const axios = require('axios');

const TALENT_API = 'https://api.talentprotocol.com/api/v1'

export default async function handler(req, res) {
  if (req.method !== "GET" || !req.query || !req.query.handle) {
    return res.status(400).json({ message: "Bad request" })
  }
  const handle = req.query.handle
  try {
    const talentreq = await axios.get(`${TALENT_API}/talents/${handle}`,
      {
        headers: {
          'X-API-KEY': process.env.TALENT_API_KEY
        }
      })

    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Cache-Control', 'no-cache')
    return res.status(200).json(talentreq.data)
  } catch (e) {
    return res.status(404).json({ message: "Not found" })
  }
}
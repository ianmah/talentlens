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
    const talentreq = await axios.get(`${TALENT_API}/connections?id=${handle}&connection_type=${type}`,
      {
        headers: {
          'X-API-KEY': process.env.TALENT_API_KEY
        }
      })

    return res.status(200).json(talentreq.data)
  } catch (e) {
    return res.status(404).json({ message: "Not found" })
  }
}
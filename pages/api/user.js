const axios = require('axios');

const TALENT_API = 'https://api.talentprotocol.com/api/v1'

export default async function handler(req, res) {
  const talentreq = await axios.get(TALENT_API + '/talents/ian', 
    {
      headers: {
        'X-API-KEY': process.env.TALENT_API_KEY
      }
    })

  res.status(200).json(talentreq.data)
}
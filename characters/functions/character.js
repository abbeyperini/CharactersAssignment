const axios = require('axios');
const API_KEY = ''
// API_KEY and URLs would be moved to environment variables on Netlify

exports.handler = async function (event, context) {
  let id = event.queryStringParameters.id
  let url = `https://www.giantbomb.com/api/character/${id}/?api_key=${API_KEY}&format=json`
  console.log(url)
  let character
  try {
    character = await axios.get(`https://www.giantbomb.com/api/character/${id}/?api_key=${API_KEY}&format=json`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    console.log(err)
    return {
      statusCode:err.statusCode || 500,
      body: err.message,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET"
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: character.data
    }),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET"
    }
  }
}
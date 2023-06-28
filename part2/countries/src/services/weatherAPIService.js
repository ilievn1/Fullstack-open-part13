import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY
const baseUrl = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=`

const getWeather = capital => {
  return (axios.get(`${baseUrl}${capital}`).then(response => response.data))
}

export default {getWeather}
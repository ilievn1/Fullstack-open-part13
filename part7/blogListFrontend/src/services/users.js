import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const clearToken = () => {
  token = null
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.get(baseUrl,config)
  return response.data
}

export default { getAll, setToken, clearToken }
import axios from 'axios'

const url = 'http://192.168.0.101'

const api = axios.create({
  baseURL: url + ':3001'
})

export default api
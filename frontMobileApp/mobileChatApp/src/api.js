import axios from 'axios'

const kemi = 'http://192.168.0.107'

const api = axios.create({
  baseURL: kemi + ':3001'
})

export default api
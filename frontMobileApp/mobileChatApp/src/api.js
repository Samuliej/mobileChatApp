import axios from 'axios'
import { HTTP_URL } from '@env'

const url = HTTP_URL
console.log('api url', url)

const api = axios.create({
  baseURL: url
})

export default api
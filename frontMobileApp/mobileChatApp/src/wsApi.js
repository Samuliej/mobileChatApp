import axios from 'axios'

const url = 'http://192.168.1.104'

const wsApi = axios.create({
  baseURL: url + ':3003'
})

export default wsApi
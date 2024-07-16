import axios from 'axios'
import { HTTP_URL } from '@env'

/**
 * Configuration for the axios instance used for API calls.
 * It sets up the base URL for all axios requests throughout the application.
 * The base URL is retrieved from environment variables.
 *
 * @module api
 * @exports api
 *
 * @example
 * import api from './api';
 * api.get('/users').then(response => console.log(response.data));
 */

const url = HTTP_URL
console.log('api url', url)

const api = axios.create({
  baseURL: url
})

export default api
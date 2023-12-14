import { useState } from 'react'
import api from '../api'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * `useSendFriendRequest` is a custom hook that provides the functionality to send a friend request.
 *  It uses the `api` module to send requests to the server.
 *  The hook returns a `sendFriendRequest` function. This function takes a username as a parameter,
 *  and sends a POST request to '/api/sendFriendRequest' with the username in the request body.
 *  If the friend request is sent successfully, the server responds with the friendship data.
 *  The `sendFriendRequest` function returns this data.
 *  If an error occurs while sending the friend request, the `sendFriendRequest` function throws the error.
 *  This allows the component that uses this hook to catch the error and handle it appropriately.
 */
const useSendFriendRequest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendFriendRequest = async (username) => {
    setLoading(true)
    setError(null)

    const authToken = await AsyncStorage.getItem('userToken')
    console.log('authToken', authToken)

    try {
      const res = await api.post('/api/sendFriendRequest/', { username }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      setLoading(false)
      console.log(res.data)
      return res.data
    } catch (err) {
      setLoading(false)
      setError('Error sending friend request')
      console.log(err)
      return null
    }
  }

  return { sendFriendRequest, loading, error, setError }
}

export default useSendFriendRequest
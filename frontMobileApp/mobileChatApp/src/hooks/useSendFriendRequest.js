import { useState, useRef, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createWebSocketConnection } from '../wsApi.js'

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
const useSendFriendRequest = (user) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const ws = useRef(null)

  useEffect(() => {
    ws.current = createWebSocketConnection('ws://192.168.0.100:3003', () => {})
    return () => {
      ws.current.close()
    }
  }, [])

  const sendFriendRequest = async (username) => {
    setLoading(true)
    setError(null)

    const authToken = await AsyncStorage.getItem('userToken')
    console.log('authToken', authToken)

    try {
      if (ws.current.readyState === WebSocket.OPEN) {
        const userToken = await AsyncStorage.getItem('userToken')
        const messageContent = {
          userId: user._id,
          token: userToken,
          type: 'SEND_FRIEND_REQUEST',
          friendUsername: username
        }
        const messageData = JSON.stringify(messageContent)
        ws.current.send(messageData)
      }

      setLoading(false)
      return { message: 'Friend request sent'}
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
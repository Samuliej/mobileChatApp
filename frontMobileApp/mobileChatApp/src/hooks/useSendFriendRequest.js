import { useState, useEffect, useContext } from 'react'
import { SocketContext } from '../Context/SocketContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

/*

  Custom hook for sending friend requests in real-time.

*/

const useSendFriendRequest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const socket = useContext(SocketContext)
  const [friendRequests, setFriendRequests] = useState([])

  // Listen for accepted friend requests and update the friend requests
  useEffect(() => {
    if (socket) {
      socket.on('friendRequestAccepted', (data) => {
        setFriendRequests(prevRequests => [...prevRequests, data])
      })

      return () => socket.off('friendRequestAccepted')
    }
  }, [socket])


  // Function for sending a single friend request
  const sendFriendRequest = async (username) => {
    setLoading(true)
    setError(null)

    const token = await AsyncStorage.getItem('userToken')

    if (!socket) {
      console.log('Socket connection not established')
      setError('Socket connection not established')
      setLoading(false)
      return null
    }

    try {
      // Friend requests are sent via websocket
      socket.emit('sendFriendRequest', { username, token })

      return new Promise((resolve, reject) => {
        socket.on('friendRequestSent', (data) => {
          socket.emit('friendRequestSent', {username, token})
          setLoading(false)
          resolve(data)
        })

        socket.on('error', (error) => {
          console.log(error)
          setLoading(false)
          console.log('Error sending friend request')
          setError('Error sending friend request')
          reject(null)
        })
      })
    } catch (err) {
      setLoading(false)
      setError('Error sending friend request')
      console.log(err)
      return null
    }
  }

  return { sendFriendRequest, loading, error, setError, friendRequests }
}

export default useSendFriendRequest
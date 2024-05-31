import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useSendFriendRequest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io.connect('http://192.168.0.104:3001') // replace with your server address
    setSocket(newSocket)

    return () => newSocket.close()
  }, [])

  const sendFriendRequest = async (username) => {
    setLoading(true)
    setError(null)

    console.log('Sending friend request to', username)

    const token = await AsyncStorage.getItem('userToken')

    if (!socket) {
      console.log('Socket connection not established')
      setError('Socket connection not established')
      setLoading(false)
      return null
    }

    try {
      socket.emit('sendFriendRequest', { username, token })

      console.log('Friend request sent')

      return new Promise((resolve, reject) => {
        socket.on('friendRequestSent', (data) => {
          console.log(data)
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

  return { sendFriendRequest, loading, error, setError }
}

export default useSendFriendRequest
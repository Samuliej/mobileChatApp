import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useSendFriendRequest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [socket, setSocket] = useState(null)
  const [friendRequests, setFriendRequests] = useState([])

  useEffect(() => {
    const newSocket = io.connect('http://192.168.0.101:3001') // replace with your server address
    setSocket(newSocket)

    newSocket.on('friendRequestAccepted', (data) => {
      console.log('useSendFR: ', data)
      setFriendRequests(prevRequests => [...prevRequests, data])
    })

    return () => newSocket.close()
  }, [])

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
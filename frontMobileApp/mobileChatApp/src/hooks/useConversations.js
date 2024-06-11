import { useState, useEffect, useContext } from 'react'
import api from '../api.js'
import { SocketContext } from '../Context/SocketContext.js'
import { UserContext } from '../Context/UserContext.js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useConversations = (user) => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const socket = useContext(SocketContext)
  const { updateUser } = useContext(UserContext)

  const fetchAndUpdate = async () => {
    const token = await AsyncStorage.getItem('userToken')
    await updateUser(token)
    await fetchFriendData() // Fetch and update the conversations
  }

  useEffect(() => {
    socket.on('newConversation', ({ conversationId, message }) => {
      fetchAndUpdate()
    })

    return () => {
      socket.off('newConversation')
    }
  }, [socket])

  useEffect(() => {
    socket.on('message', (newMessage) => {
      setConversations((prevConversations) => {
        return prevConversations.map((conversation) => {
          if (conversation._id === newMessage.conversationId) {
            return { ...conversation, lastMessage: newMessage }
          } else {
            return conversation
          }
        })
      })
    })

    return () => {
      socket.off('message')
    }
  }, [socket])

  useEffect(() => {
    if (user?.conversations) {
      fetchFriendData()
    } else {
      setConversations([])
      setLoading(false)
    }
  }, [user, socket])

  const fetchFriendData = async () => {
    const updatedConversations = await Promise.all(user.conversations.map(async (conversation) => {
      const friendId = conversation.participants.find(id => id !== user._id)
      if (friendId) {
        const response = await api.get(`/api/users/id/${friendId}`)
        const friend = await response.data

        // Fetch the messages for the conversation
        const messagesResponse = await api.get(`/api/conversations/${conversation._id}/messages`)
        const messages = await messagesResponse.data
        const lastMessage = messages[messages.length - 1]

        return { ...conversation, friend, lastMessage }
      }
    }))

    setConversations(updatedConversations)
    setLoading(false)
  }

  return { conversations, loading }
}

export default useConversations
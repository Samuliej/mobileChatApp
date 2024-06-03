import { useState, useEffect, useRef } from 'react'
import api from '../api.js'
import { createWebSocketConnection } from '../wsApi.js'

const useConversations = (user) => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const ws = useRef(null)

  useEffect(() => {
    ws.current = createWebSocketConnection('ws://192.168.0.101:3003')

    ws.current.onmessage = async (event) => {
      const messageData = JSON.parse(event.data)
      setConversations(prevConversations => {
        return prevConversations.map(conversation => {
          if (conversation._id === messageData.conversationId) {
            return {
              ...conversation,
              lastMessage: messageData.message,
            }
          } else {
            return conversation
          }
        })
      })
    }

    return () => {
      ws.current.close()
    }
  }, [ws])

  useEffect(() => {
    if (user?.conversations) {
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

      fetchFriendData()
    } else {
      setConversations([])
      setLoading(false)
    }
  }, [user])

  return { conversations, loading }
}

export default useConversations
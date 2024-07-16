import { useState, useEffect, useContext } from 'react'
import api from '../api.js'
import { SocketContext } from '../Context/SocketContext.js'
import { UserContext } from '../Context/UserContext.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decrypt } from 'react-native-simple-encryption'

/**
 * Custom hook for managing conversations in a React application.
 * It handles fetching conversations, listening for new conversations and messages via websockets,
 * and decrypting messages.
 *
 * @param {object} user - The current user object.
 * @returns {object} An object containing the conversations array, loading state, and functions to set conversations and fetch/update them.
 *
 * @example
 * const { conversations, loading, setConversations, fetchAndUpdate } = useConversations(user);
 */
const useConversations = (user) => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const socket = useContext(SocketContext)
  const { updateUser } = useContext(UserContext)

  // Fetch and update the conversations
  const fetchAndUpdate = async () => {
    const token = await AsyncStorage.getItem('userToken')
    await updateUser(token)
    await fetchFriendData()
  }

  useEffect(() => {
    socket.on('newConversation', () => {
      fetchAndUpdate()
    })

    return () => {
      socket.off('newConversation')
    }
  }, [socket])

  useEffect(() => {
    // Listens to new messages and updates the conversations
    // Also handles adding the emojies back, since they can't be encrypted
    socket.on('messageToConvo', (newMessage) => {
      console.log('ping')
      setConversations((prevConversations) => {
        return prevConversations.map((conversation) => {
          if (conversation._id === newMessage.conversationId) {
            let decryptedContent = decrypt(conversation.encryptionKey, newMessage.content)

            if (newMessage.emojis && newMessage.emojis.length > 0) {
              const sortedEmojis = newMessage.emojis.sort((a, b) => b.index - a.index)
              sortedEmojis.forEach(({ emoji, index }) => {
                decryptedContent = decryptedContent.slice(0, index) + emoji + decryptedContent.slice(index)
              })
            }

            return { ...conversation, lastMessage: {...newMessage, content: decryptedContent} }
          } else {
            return conversation
          }
        })
      })
    })

    return () => {
      socket.off('messageToConvo')
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

  // Function for fetching messages and friend's data
  const fetchFriendData = async () => {
    const updatedConversations = await Promise.all(user.conversations.map(async (conversation) => {
      const friendId = conversation.participants?.find(id => id !== user._id)
      if (friendId) {
        const response = await api.get(`/api/users/id/${friendId}`)
        const friend = await response.data

        // Fetch the messages for the conversation
        // Also handles adding the emojies back, since they can't be encrypted
        const messagesResponse = await api.get(`/api/conversations/${conversation._id}/messages`)
        const messages = await messagesResponse.data
        let lastMessage = messages[messages.length - 1]
        try {
          if (lastMessage) {
            let decryptedContent = decrypt(conversation.encryptionKey, lastMessage.content)
            if (lastMessage.emojis && lastMessage.emojis.length > 0) {
              const sortedEmojis = lastMessage.emojis.sort((a, b) => b.index - a.index)
              sortedEmojis.forEach(({ emoji, index }) => {
                decryptedContent = decryptedContent.slice(0, index) + emoji + decryptedContent.slice(index)
              })
            }

            lastMessage.content = decryptedContent
          }
        } catch (error) {
          console.error("Decryption error:", error)
        }

        return { ...conversation, friend, lastMessage }
      }
    }))

    setConversations(updatedConversations)
    setLoading(false)
  }

  return { conversations, loading, setConversations, fetchAndUpdate }
}

export default useConversations
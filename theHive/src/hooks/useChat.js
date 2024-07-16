import { useState, useEffect, useContext } from 'react'
import api from '../api.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SocketContext } from '../Context/SocketContext.js'
import { encrypt, decrypt } from 'react-native-simple-encryption'
import { useInfiniteQuery, useQueryClient } from 'react-query'

/**
 * Extracts emojis and their indices from a given message string.
 *
 * @param {string} message - The message string to extract emojis from.
 * @returns {object} An object containing the cleaned message without emojis and an array of extracted emojis with their indices.
 */
const extractEmojis = (message) => {
  const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g
  let match
  const emojis = []
  let cleanedMessage = message

  while ((match = emojiRegex.exec(message)) !== null) {
    const emoji = match[0]
    const index = match.index
    emojis.push({ emoji, index })
    cleanedMessage = cleanedMessage.replace(emoji, "")
  }

  // Sort the emojis based on their indices
  emojis.sort((a, b) => a.index - b.index)

  return { cleanedMessage, emojis }
}

/**
 * Determines if a given message consists only of emojis.
 *
 * @param {string} message - The message string to check.
 * @returns {boolean} True if the message consists only of emojis, false otherwise.
 */
const isMessageOnlyEmojis = (message) => {
  const { cleanedMessage } = extractEmojis(message)
  return cleanedMessage.trim().length === 0
}


/**
 * Custom hook for managing chat functionalities in a React application.
 * It handles fetching conversations, sending messages, and real-time updates via websockets.
 *
 * @param {object} user - The current user object.
 * @param {string} conversationId - The ID of the current conversation.
 * @param {object} initialFriend - The initial friend object in the conversation.
 * @returns {object} An object containing various states and functions for chat management.
 *
 * @example
 * const { messagesData, sendMessage, newMessage, setNewMessage } = useChat(user, conversationId, initialFriend);
 */
const useChat = (user, conversationId, initialFriend) => {
  const [friend, setFriend] = useState(initialFriend)
  const [conversation, setConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(0)
  const [loading, setLoading] = useState(false)
  const socket = useContext(SocketContext)
  const queryClient = useQueryClient()

  // Fetch the first page of messages when the component mounts
  useEffect(() => {
    setLoading(true)
    fetchConversation({ pageParam: 1 }).finally(() => setLoading(false))
  }, [conversationId, user])

  useEffect(() => {
    // Listens to new messages, and updates the conversation
    socket.on('message', (newMessage) => {
      if (!conversation || newMessage.sender === user._id) {
        // If conversation is null or the sender is the current user, don't proceed
        return
      }
      // Decrypt the message content
      let decryptedContent

      if (newMessage.justEmojis) {
        decryptedContent = newMessage.content
      } else {
        decryptedContent = decrypt(conversation.encryptionKey, newMessage.content)
      }
      // Check if there are emojis to be added back to the decrypted content
      if (newMessage.emojis && newMessage.emojis.length > 0) {
        const sortedEmojis = newMessage.emojis.sort((a, b) => a.index - b.index)
        sortedEmojis.forEach(({ emoji, index }) => {
          decryptedContent = decryptedContent.slice(0, index) + emoji + decryptedContent.slice(index)
        })
      }

      const newDisplayedMessage = {
        ...newMessage,
        content: decryptedContent,
      }

      queryClient.setQueryData(['conversations', conversationId], oldData => {
        const updatedPages = oldData.pages.map((page, index) => {
          if (index === 0) {
            // Add the new message to the first page
            return {
              ...page,
              conversation: {
                ...page.conversation,
                messages: [newDisplayedMessage, ...page.conversation.messages]
              }
            }
          }
          return page
        })

        return {
          ...oldData,
          pages: updatedPages
        }
      })
    })

    return () => {
      socket.off('message')
    }
  }, [socket, conversation, user._id, queryClient, conversationId])


  // Function for fetching a single conversation
  const fetchConversation = async ({ pageParam = 1 }) => {
    const token = await AsyncStorage.getItem('userToken')
    const response = await api.get(`/api/conversations/${conversationId}?page=${pageParam}&limit=20`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.data

    const conversation = data.conversation
    setConversation(conversation)

    if (user) {
      const friend = conversation.participants.find(participant => participant._id !== user._id)
      setFriend(friend)
    }
    // Decrypt messages here
    let decryptedMessages = data.conversation.messages.map((m) => {
      let content = m.justEmojis ? m.content : decrypt(conversation.encryptionKey, m.content)
      if (m.emojis && m.emojis.length > 0) {
        const sortedEmojis = m.emojis.sort((a, b) => a.index - b.index)
        sortedEmojis.forEach(({ emoji, index }) => {
          content = content.slice(0, index) + emoji + content.slice(index)
        })
      }

      return {
        ...m,
        content: content
      }
    })

    // Return undefined if there is no next page
    const nextPage = data.hasNextPage ? pageParam + 1 : undefined

    return { ...data, conversation: { ...conversation, messages: decryptedMessages }, nextPage: nextPage }

  }


  const {
    data: messagesData,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(['conversations', conversationId], fetchConversation, {
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  // Function for sending a message
  const sendMessage = async () => {
    const userToken = await AsyncStorage.getItem('userToken')
    try {

      const { cleanedMessage, emojis } = extractEmojis(newMessage)

      const onlyEmojis = isMessageOnlyEmojis(cleanedMessage)
      let messageContent
      let displayedMessageContent

      if (!onlyEmojis) {

        const encryptedMessage = encrypt(conversation.encryptionKey, cleanedMessage)

        messageContent = {
          placeHolder: true,
          content: encryptedMessage,
          emojis: emojis,
          justEmojis: false,
          conversationId,
          token: userToken,
          receiver: friend._id,
          sender: user._id,
          timestamp: Date.now(),
        }

        displayedMessageContent = {
          ...messageContent,
          content: cleanedMessage,
        }

      } else {
        messageContent = {
          placeHolder: true,
          content: '',
          emojis: emojis,
          justEmojis: true,
          conversationId,
          token: userToken,
          receiver: friend._id,
          sender: user._id,
          timestamp: Date.now(),
        }
      }

      displayedMessageContent = {
        ...messageContent,
        content: newMessage,
      }

      setConversation(prevConversation => ({
        ...prevConversation,
        messages: [...prevConversation.messages, displayedMessageContent],
      }))

      queryClient.setQueryData(['conversations', conversationId], oldData => {
        const updatedPages = oldData.pages.map((page, index) => {
          if (index === 0) {
            // Add the new message to the first page
            return {
              ...page,
              conversation: {
                ...page.conversation,
                messages: [displayedMessageContent, ...page.conversation.messages]
              }
            }
          }
          return page
        })

        return {
          ...oldData,
          pages: updatedPages
        }
      })


      socket.emit('message', messageContent)

      setNewMessage('')
    } catch (error) {
      console.log(error)
    }
  }

  return {
    messagesData, newMessage, setNewMessage, inputHeight,
    setInputHeight, isLoading, sendMessage, fetchNextPage,
    hasNextPage, friend, conversation, loading
  }
}

export default useChat
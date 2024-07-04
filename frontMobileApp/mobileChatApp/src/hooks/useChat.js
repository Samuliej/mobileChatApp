import { useState, useEffect, useContext } from 'react'
import api from '../api.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SocketContext } from '../Context/SocketContext.js'
import { encrypt, decrypt } from 'react-native-simple-encryption'

/*

  Custom hook for enabling real-time messaging in the application

*/

// Utility function to extract emojis and their indices from a message
const extractEmojis = (message) => {
  const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g // Basic regex for matching surrogate pairs (common for emojis)
  let match
  const emojis = []
  let cleanedMessage = message

  while ((match = emojiRegex.exec(message)) !== null) {
    const emoji = match[0]
    const index = match.index
    emojis.push({ emoji, index })
    cleanedMessage = cleanedMessage.replace(emoji, "") // Remove emoji from the message
  }

  return { cleanedMessage, emojis }
}

const isMessageOnlyEmojis = (message) => {
  const { cleanedMessage } = extractEmojis(message)
  return cleanedMessage.length === 0
}

const useChat = (user, conversationId, initialFriend) => {
  const [friend, setFriend] = useState(initialFriend)
  const [conversation, setConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(0)
  const [loading, setLoading] = useState(false)
  const socket = useContext(SocketContext)

  // Fetch the first page of messages when the component mounts
  useEffect(() => {
    setLoading(true)
    fetchConversation()
  }, [conversationId, user])

  useEffect(() => {
    // Listens to new messages, and updates the conversation
    socket.on('message', (newMessage) => {
      setConversation((prevConversation) => {
        const messages = prevConversation.messages.map((message) =>
          message.content === newMessage.content &&
          message.sender === newMessage.sender &&
          message.placeHolder
            ? { ...newMessage, placeHolder: false }
            : message
        )

        return { ...prevConversation, messages }
      })
    })

    return () => {
      socket.off('message')
    }
  }, [socket])

  // Function for fetching a single conversation
  const fetchConversation = async () => {
    const response = await api.get(`/api/conversations/${conversationId}`)
    const fetchedConversation = await response.data

    // Sort the messages
    const sortedMessages = fetchedConversation.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    if (user) {
      const friend = fetchedConversation.participants.find(participant => participant._id !== user._id)
      setFriend(friend)
    }

    const encryptionKey = fetchedConversation.encryptionKey

    // Use encryptionKey for decrypting messages
    // Also handles adding the emojies back, since they can't be encrypted
    const decryptedMessages = sortedMessages.map(m => {
      let content = m.justEmojis ? m.content : decrypt(encryptionKey, m.content)
      if (m.emojis && m.emojis.length > 0) {
        const sortedEmojis = m.emojis.sort((a, b) => b.index - a.index)
        sortedEmojis.forEach(({ emoji, index }) => {
          content = content.slice(0, index) + emoji + content.slice(index)
        })
      }

      return {
        ...m,
        content: content
      }
    })

    setConversation({...fetchedConversation, messages: decryptedMessages})
    setLoading(false)
  }


  // Function for sending a message
  const sendMessage = async () => {
    const userToken = await AsyncStorage.getItem('userToken')

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
      placeHolder: true,
      content: newMessage,
      conversationId,
      token: userToken,
      receiver: friend._id,
      sender: user._id,
      timestamp: Date.now(),
    }

    setConversation(prevConversation => ({
      ...prevConversation,
      messages: [...prevConversation.messages, displayedMessageContent],
    }))

    socket.emit('message', messageContent)

    setNewMessage('')
  }

  return { friend, conversation, newMessage, setNewMessage, inputHeight, setInputHeight, loading, sendMessage }
}

export default useChat
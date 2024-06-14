import { useState, useEffect, useContext } from 'react'
import api from '../api.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SocketContext } from '../Context/SocketContext.js'

/*

  Custom hook for enabling real-time messaging in the application

*/

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
    setConversation({...fetchedConversation, messages: sortedMessages})
    setLoading(false)
  }


  // Function for sending a message
  const sendMessage = async () => {
    const userToken = await AsyncStorage.getItem('userToken')

    const messageContent = {
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
      messages: [...prevConversation.messages, messageContent],
    }))

    socket.emit('message', messageContent)

    setNewMessage('')
  }

  return { friend, conversation, newMessage, setNewMessage, inputHeight, setInputHeight, loading, sendMessage }
}

export default useChat
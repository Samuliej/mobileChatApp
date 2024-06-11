import { useState, useEffect, useContext } from 'react'
import api from '../api.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SocketContext } from '../Context/SocketContext.js'


const useChat = (user, conversationId, initialFriend) => {
  const [friend, setFriend] = useState(initialFriend)
  const [conversation, setConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(0)
  const [loading, setLoading] = useState(false)
  const socket = useContext(SocketContext)

  useEffect(() => {
    setLoading(true)
    fetchConversation() // Fetch the first page of messages when the component mounts
  }, [conversationId, user])

  useEffect(() => {
    socket.on('message', (newMessage) => {
      setConversation((prevConversation) => {
        return {
          ...prevConversation,
          messages: [...prevConversation.messages, newMessage]
        }
      })
    })

    socket.emit('newMessage', { conversationId, message: newMessage })

    return () => {
      socket.off('message')
    }
  }, [socket])

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


  const sendMessage = async () => {
    const userToken = await AsyncStorage.getItem('userToken')
    const messageContent = {
      content: newMessage,
      conversationId,
      token: userToken,
      receiver: friend._id,
      sender: user._id,
      timestamp: Date.now(),
    }
    socket.emit('message', messageContent)

    setNewMessage('')
  }

  return { friend, conversation, newMessage, setNewMessage, inputHeight, setInputHeight, loading, sendMessage }
}

export default useChat
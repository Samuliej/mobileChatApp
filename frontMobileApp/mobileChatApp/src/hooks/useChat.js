import { useState, useEffect, useRef } from 'react'
import api from '../api.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createWebSocketConnection } from '../wsApi.js'


const useChat = (user, conversationId, initialFriend) => {
  const [friend, setFriend] = useState(initialFriend)
  const [conversation, setConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(0)
  const [loading, setLoading] = useState(false)
  const ws = useRef(null)

  useEffect(() => {
    ws.current = createWebSocketConnection('ws://192.168.0.100:3003')
    return () => {
      ws.current.close()
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchConversation() // Fetch the first page of messages when the component mounts
  }, [conversationId, user])

  useEffect(() => {
    if (ws.current) {
      ws.current.onmessage = (message) => {
        const messageData = JSON.parse(message.data)
        if (messageData.conversationId === conversationId) {
          console.log(user._id)
          console.log(messageData)
          // another user sent a message to the conversation
          if (messageData.message.sender !== user._id) {
            const newMessage = messageData.message
            setConversation(prevConversation => {
              const existingMessageIndex = prevConversation.messages.findIndex(m => m._id === newMessage._id)
              if (existingMessageIndex === -1) {
                // The received message is not in the conversation, add it as a new message
                return {...prevConversation, messages: [...prevConversation.messages, newMessage]}
              }
              return prevConversation
            })
          }
        }
      }
    }
  }, [ws, conversation])

  const fetchConversation = async () => {
    const response = await api.get(`/api/conversations/${conversationId}`)
    const fetchedConversation = await response.data

    // Sort the messages
    const sortedMessages = fetchedConversation.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (user) {
      const friend = fetchedConversation.participants.find(participant => participant._id !== user._id)
      setFriend(friend)
    }
    setConversation({...fetchedConversation, messages: sortedMessages})
    setLoading(false)
  }


  const sendMessage = async () => {
    if (ws.current.readyState === WebSocket.OPEN) {
      const userToken = await AsyncStorage.getItem('userToken')
      const messageContent = {
        content: newMessage,
        conversationId,
        token: userToken,
        sender: user._id,
        timestamp: Date.now(),
      }
      const messageData = JSON.stringify(messageContent)
      ws.current.send(messageData)

      // Add the sent message to the conversation immediately
      setConversation(prevConversation => {
        return {...prevConversation, messages: [...prevConversation.messages, {...messageContent, sender: user}]}
      })
    }
    setNewMessage('')
  }

  return { friend, conversation, newMessage, setNewMessage, inputHeight, setInputHeight, loading, sendMessage }
}

export default useChat
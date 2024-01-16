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
    setLoading(true)
    const fetchConversation = async () => {
      const response = await api.get(`/api/conversations/${conversationId}`)
      const fetchedConversation = await response.data

      if (user) {
        const friend = fetchedConversation.participants.find(participant => participant._id !== user._id)
        setFriend(friend)
      }
      setConversation(fetchedConversation)
      setLoading(false)
    }

    fetchConversation()

    ws.current = createWebSocketConnection('ws://192.168.1.104:3003', (messageData) => {
      if (messageData.conversation._id === conversationId) {
        setConversation(messageData.conversation)
      }
    })

    return () => {
      ws.current.close()
    }
  }, [conversationId, user])

  const sendMessage = async () => {
    if (ws.current.readyState === WebSocket.OPEN) {
      console.log('ws open, trying to send message')
      const token = await AsyncStorage.getItem('userToken')
      fetch('http://192.168.1.104:3003/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // include the token in the Authorization header
        },
        body: JSON.stringify({ content: newMessage, conversationId })
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
          console.error('Error:', error)
        })
    }
    setNewMessage('')
  }

  return { friend, conversation, newMessage, setNewMessage, inputHeight, setInputHeight, loading, sendMessage }
}

export default useChat
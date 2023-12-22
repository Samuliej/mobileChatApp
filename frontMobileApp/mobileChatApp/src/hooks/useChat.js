import { useState, useEffect } from 'react'
import api from '../api.js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useChat = (user, conversationId, initialFriend) => {
  const [friend, setFriend] = useState(initialFriend)
  const [conversation, setConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetchConversation = async () => {
      const response = await api.get(`/api/conversations/${conversationId}`)
      const fetchedConversation = await response.data

      // Check that user is not null before trying to access its properties
      if (user) {
        // Find the friend in the participants list
        const friend = fetchedConversation.participants.find(participant => participant._id !== user._id)

        setFriend(friend)
      }
      setConversation(fetchedConversation)
      setLoading(false)
    }

    fetchConversation()
  }, [conversationId, user])

  const sendMessage = async () => {
    // send the new message
    const userToken = await AsyncStorage.getItem('userToken')
    const response = await api.post('/api/sendMessage', { content: newMessage, conversationId }, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })

    // Response is { convo, msg } so we can get the updated conversation
    const updatedConversation =  response.data.conversation
    const newMsg = response.data.message
    console.log('newMsg', newMsg)
    setConversation(updatedConversation)

    setNewMessage('')
  }

  return { friend, conversation, newMessage, setNewMessage, inputHeight, setInputHeight, loading, sendMessage }
}

export default useChat
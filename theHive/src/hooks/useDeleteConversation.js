import { useState } from 'react'
import api from '../api'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Custom hook for deleting a conversation.
 * It provides functionality to delete a conversation by its ID, handling loading state and errors.
 *
 * @returns {object} An object containing:
 *                  - deleteConversation: Function to call for deleting a conversation by ID.
 *                  - isLoading: Boolean indicating if the delete operation is in progress.
 *                  - error: The error message if an error occurred, otherwise null.
 *
 * @example
 * const { deleteConversation, isLoading, error } = useDeleteConversation();
 */
const useDeleteConversation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteConversation = async (id) => {
    setIsLoading(true)
    setError(null)
    const token = await AsyncStorage.getItem('userToken')

    try {
      const response = await api.delete(`/api/conversations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error deleting conversation')
      }

      const data = await response.json()

      setIsLoading(false)
      return data

    } catch (error) {
      setIsLoading(false)
      setError(error.message)
    }
  }

  return { deleteConversation, isLoading, error }
}

export default useDeleteConversation
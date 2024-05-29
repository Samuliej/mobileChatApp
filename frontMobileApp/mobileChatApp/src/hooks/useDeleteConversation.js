import { useState } from 'react'
import api from '../api'

const useDeleteConversation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteConversation = async (id) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.delete(`/api/conversations/${id}`)

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

  return [deleteConversation, isLoading, error]
}

export default useDeleteConversation
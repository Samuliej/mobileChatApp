import { useState, useEffect } from 'react'
import api from '../api'

export const useGetUserById = (userId) => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (userId) {
      setLoading(true)
      api.get(`/api/users/id/${userId}`)
        .then(response => {
          setUser(response.data)
          setLoading(false)
          return response.data
        })
        .catch(error => {
          setError(error)
          setLoading(false)
        })
    }
  }, [userId])

  return { loading, user, error }
}
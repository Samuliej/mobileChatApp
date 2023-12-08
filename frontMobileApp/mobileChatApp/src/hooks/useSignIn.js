import { useState } from 'react'
import api from '../api'

const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const signIn = async (username, password) => {
    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/api/login', { username, password })
      setLoading(false)
      return res.data.token
    } catch (err) {
      setLoading(false)
      setError('Incorrect username or password')
      return null
    }
  }

  return { signIn, loading, error, setError }
}

export default useSignIn
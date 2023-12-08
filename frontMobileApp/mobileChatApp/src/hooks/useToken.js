import { useState, useEffect } from 'react'
import { getToken } from '../utils/utils'

export default function useToken() {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const fetchToken = async () => {
      const newToken = await getToken()
      setToken(newToken)
    }

    fetchToken()
  }, [])

  return token
}
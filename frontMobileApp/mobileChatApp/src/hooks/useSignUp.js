import { useState } from 'react'
import api from '../api'

const useSignUp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const signUp = async (username, password, name, profilePicture, phone, city) => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      formData.append('name', name)
      if (profilePicture) {
        formData.append('profilePicture', {
          uri: profilePicture.uri,
          type: profilePicture.type,
          name: profilePicture.name,
        })
      }
      formData.append('phone', phone)
      formData.append('city', city)

      const res = await api.post('/api/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setLoading(false)
      return res.data
    } catch (err) {
      setLoading(false)
      setError('Something went wrong creating the user')
      console.log(err)
      return null
    }
  }

  return { signUp, loading, error, setError }
}

export default useSignUp
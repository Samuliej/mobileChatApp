import { useState } from 'react'
import api from '../api'


/**
 * Custom hook for handling user sign-up.
 * It manages the sign-up process, including loading and error states, and supports uploading a profile picture.
 *
 * @returns {object} An object containing:
 *                  - signUp: A function to sign up a new user with provided details. It supports uploading a profile picture.
 *                            The function takes parameters for username, password, name, profilePicture (optional), phone, and city.
 *                  - loading: A boolean indicating if the sign-up process is currently in progress.
 *                  - error: An error message if an error occurred during sign-up.
 *                  - setError: A function to manually set the error state.
 *
 * @example
 * const { signUp, loading, error, setError } = useSignUp();
 * signUp('username', 'password', 'name', profilePicture, 'phone', 'city');
 */
const useSignUp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function for signing up
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
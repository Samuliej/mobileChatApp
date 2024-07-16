import { useState } from 'react'
import api from '../api'


/**
 * Custom hook for handling user sign-in.
 * It manages the sign-in process, including loading and error states.
 *
 * @returns {object} An object containing:
 *                  - signIn: A function to sign in a user with a username and password. Returns the user's token if successful.
 *                  - loading: A boolean indicating if the sign-in process is currently in progress.
 *                  - error: An error message if an error occurred during sign-in.
 *                  - setError: A function to manually set the error state.
 *
 * @example
 * const { signIn, loading, error, setError } = useSignIn();
 * signIn('username', 'password');
 */
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
      console.log(err)
      return null
    }
  }

  return { signIn, loading, error, setError }
}

export default useSignIn
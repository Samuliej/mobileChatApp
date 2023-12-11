import { useState } from 'react'
import api from '../api'


/**
 * `useSignIn` is a custom hook that provides the functionality to sign in the user.
 *
 * It uses the `api` module to send requests to the server.
 *
 * The hook returns a `signIn` function. This function takes a username and password as parameters, and sends a POST request to '/api/login' with the username and password in the request body.
 *
 * If the sign in is successful, the server responds with a token. The `signIn` function returns this token.
 *
 * If an error occurs while signing in, the `signIn` function throws the error. This allows the component that uses this hook to catch the error and handle it appropriately.
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
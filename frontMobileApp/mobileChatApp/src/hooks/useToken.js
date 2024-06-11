import { useState, useEffect } from 'react'
import { getToken } from '../utils/utils'


/**
   `useToken` is a custom hook that manages the state of the user token.
    It uses the `useState` and `useEffect` hooks from React, and the `getToken` function from the 'utils' module.
    The `useState` hook initializes the `token` state to `null`.
    The `useEffect` hook is used to fetch the token from AsyncStorage when the component mounts. It defines an asynchronous `fetchToken` function that calls `getToken` and updates the `token` state with the returned value. Then it calls `fetchToken`.
    The hook returns the `token` state. This allows components that use this hook to access the user token.
 */
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
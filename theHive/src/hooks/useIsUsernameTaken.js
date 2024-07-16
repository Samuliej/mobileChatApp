import { useState } from 'react'
import api from '../api'

/**
 * Custom hook for checking if a username is already taken.
 * It provides a method to check the availability of a username and manages the loading state and the result.
 *
 * @returns {object} An object containing:
 *                  - isLoading: A boolean indicating if the check operation is in progress.
 *                  - isTaken: A boolean indicating if the username is taken.
 *                  - check: A function to call with a username to check its availability.
 *
 * @example
 * const { isLoading, isTaken, check } = useIsUsernameTaken();
 * check('desiredUsername');
 */
const useIsUsernameTaken = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isTaken, setIsTaken] = useState(false)

  const check = async (username) => {
    setIsLoading(true)
    const response = await api.get(`/api/username/${username}`)
    setIsTaken(response.data.isTaken)
    setIsLoading(false)
  }

  return { isLoading, isTaken, check }
}

export default useIsUsernameTaken
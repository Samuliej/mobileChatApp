import { useState, useEffect } from 'react'
import api from '../api'


/**
 * Custom hook for fetching a user by their ID.
 * It manages the loading state, the fetched user data, and any errors that may occur during the fetch operation.
 *
 * @param {string} userId - The ID of the user to fetch.
 * @returns {object} An object containing:
 *                  - loading: A boolean indicating if the fetch operation is in progress.
 *                  - user: The fetched user object or null if not found or not fetched yet.
 *                  - error: An error object if an error occurred during the fetch operation, otherwise null.
 *
 * @example
 * const { loading, user, error } = useGetUserById(userId);
 */
const useGetUserById = (userId) => {
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

export default useGetUserById
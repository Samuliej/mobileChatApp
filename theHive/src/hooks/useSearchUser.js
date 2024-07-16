import { useState, useEffect, useContext } from 'react'
import api from '../api'
import { UserContext } from '../Context/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Custom hook for searching users based on a query string and pagination.
 * It leverages the UserContext to exclude the current user from the search results.
 * The search results are reset when the query changes and are paginated.
 *
 * @param {string} query - The search query string.
 * @param {number} page - The current page number for pagination.
 * @returns {object} An object containing:
 *                  - loading: A boolean indicating if the search is in progress.
 *                  - searchResults: An array of user objects that match the search query, excluding the current user.
 *                  - error: An error object if an error occurred during the search.
 *
 * @example
 * const { loading, searchResults, error } = useSearchUser('john', 1);
 */
const useSearchUser = (query, page) => {
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState(null)
  const { user } = useContext(UserContext)
  let currentUser = user

  // Reset the search results when the query changes
  useEffect(() => {
    setSearchResults([])
  }, [query])

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.length > 0) {
        try {
          setLoading(true)
          const token = await AsyncStorage.getItem('userToken')
          const response = await api.get(`/api/users/search/${query}?page=${page}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const filteredResults = response.data.filter(user => user._id !== currentUser._id)
          if (page === 1) {
            setSearchResults(filteredResults)
          } else {
            setSearchResults(prevResults => {
              const newResults = [...prevResults, ...filteredResults]
              return Array.from(new Set(newResults.map(user => user._id))).map(id => newResults.find(user => user._id === id))
            })
          }
        } catch (error) {
          setError(error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUsers()
  }, [query, page, currentUser])

  return { loading, searchResults, error }
}

export default useSearchUser
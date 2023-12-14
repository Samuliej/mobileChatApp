import { useState, useEffect, useContext } from 'react'
import api from '../api'
import { UserContext } from '../Context/UserContext'

export const useSearchUser = (query, page) => {
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
    if (query.length > 0) {
      setLoading(true)
      api.get(`/api/users/search/${query}?page=${page}`)
        .then(response => {
          const filteredResults = response.data.filter(user => user._id !== currentUser._id)
          if (page === 1) {
            setSearchResults(filteredResults)
          } else {
            setSearchResults(prevResults => {
              const newResults = [...prevResults, ...filteredResults]
              return Array.from(new Set(newResults.map(user => user._id))).map(id => newResults.find(user => user._id === id))
            })
          }
          setLoading(false)
        })
        .catch(error => {
          setError(error)
          setLoading(false)
        })
    }
  }, [query, page, currentUser])

  return { loading, searchResults, error }
}
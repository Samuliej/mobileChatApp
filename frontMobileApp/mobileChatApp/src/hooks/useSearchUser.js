import { useState, useEffect } from 'react'
import api from '../api'

export const useSearchUser = (query, page) => {
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true)
      api.get(`/api/users/search/${query}?page=${page}`)
        .then(response => {
          if (page === 1) {
            setSearchResults(response.data)
            setLoading(false)
          } else {
            setSearchResults(prevResults => [...prevResults, ...response.data])
          }
          setLoading(false)
        })
        .catch(error => {
          setError(error)
          setLoading(false)
        })
    }
  }, [query, page])

  return { loading, searchResults, error }
}
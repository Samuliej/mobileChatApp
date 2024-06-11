import { useState } from 'react'
import api from '../api'

/*

  Custom hook for checking whether a username is taken or not

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
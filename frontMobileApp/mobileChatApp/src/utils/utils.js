import AsyncStorage from '@react-native-async-storage/async-storage'

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken')
    return token
  } catch (e) {
    console.error(e)
  }
}

// Function that formats the timestamp depending if it's sent on
// the same day, month or year
export const formatTimestamp = (timestamp) => {
  const messageDate = new Date(timestamp)
  const currentDate = new Date()
  const sameDay = messageDate.toDateString() === currentDate.toDateString()
  const sameYear = messageDate.getFullYear() === currentDate.getFullYear()
  const sameMonth = messageDate.getMonth() === currentDate.getMonth()

  if (sameDay)
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  else if (sameYear && sameMonth)
    return messageDate.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  else if (sameYear)
    return messageDate.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  else
    return messageDate.toLocaleString()
}

// Truncate a string to n characters
export const truncate = (input, chars) => input.length > chars ? `${input.substring(0, chars)}...` : input

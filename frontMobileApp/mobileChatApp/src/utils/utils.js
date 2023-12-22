import AsyncStorage from '@react-native-async-storage/async-storage'

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken')
    return token
  } catch (e) {
    console.error(e)
  }
}

// Truncate a string to n characters
export const truncate = (input, chars) => input.length > chars ? `${input.substring(0, chars)}...` : input

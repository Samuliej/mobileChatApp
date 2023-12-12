import AsyncStorage from '@react-native-async-storage/async-storage'

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken')
    return token
  } catch (e) {
    console.error(e)
  }
}

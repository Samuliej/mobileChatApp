import * as React from 'react'
import { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserProvider } from './src/Context/UserContext.js'
import RootNavigator from './src/Components/RootNavigator/index.jsx'

const App = () => {


  useEffect(() => {
    const clearStorage = async () => {
      await AsyncStorage.clear()
    }

    clearStorage()
  }, [])


  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  )
}

export default App
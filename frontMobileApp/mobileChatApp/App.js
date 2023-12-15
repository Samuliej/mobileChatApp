import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { UserProvider } from './src/Context/UserContext.js'
import RootNavigator from './src/Components/RootNavigator/index.jsx'

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  )
}

export default App
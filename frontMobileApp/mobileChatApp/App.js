import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { UserProvider } from './src/Context/UserContext.js'
import { NotificationProvider } from './src/Context/NotificationContext.js'
import { FriendRequestProvider } from './src/Context/FriendRequestContext.js'
import RootNavigator from './src/Components/RootNavigator/index.jsx'

const App = () => {
  return (
    <NotificationProvider>
      <UserProvider>
        <FriendRequestProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </FriendRequestProvider>
      </UserProvider>
    </NotificationProvider>
  )
}

export default App
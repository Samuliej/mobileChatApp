import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { UserProvider } from './src/Context/UserContext.js'
import { NotificationProvider } from './src/Context/NotificationContext.js'
import { FriendRequestProvider } from './src/Context/FriendRequestContext.js'
import { SocketProvider } from './src/Context/SocketContext.js'
import RootNavigator from './src/Components/RootNavigator/index.jsx'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

/**
 * Main application component that sets up the global context providers and navigation.
 * It wraps the entire app in various context providers such as UserContext, NotificationContext,
 * FriendRequestContext, and SocketContext for managing global state. It also sets up React Query
 * for data fetching and state management. The NavigationContainer from react-navigation is used
 * to manage app navigation.
 *
 * @returns {React.Component} The root component of the application.
 */
const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <UserProvider>
          <FriendRequestProvider>
            <NavigationContainer>
              <SocketProvider>
                <RootNavigator />
              </SocketProvider>
            </NavigationContainer>
          </FriendRequestProvider>
        </UserProvider>
      </NotificationProvider>
    </QueryClientProvider>
  )
}

export default App
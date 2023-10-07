import { StatusBar } from 'expo-status-bar'
import { NativeRouter } from 'react-router-native'
import Main from './src/components/Main'
import { ApolloProvider } from '@apollo/client'
import AuthStorage from './src/utils/authStorage'
import createApolloClient from './src/utils/apolloClient'
import AuthStorageContext from './src/context/AuthStorageContext'
import { NavigationContainer } from '@react-navigation/native'

const authStorage = new AuthStorage()
const apolloClient = createApolloClient(authStorage)

const App = () => {
  return (
    <>
    <NavigationContainer>
      <NativeRouter>
        <ApolloProvider client={apolloClient}>
          <AuthStorageContext.Provider value={authStorage}>
            <Main />
          </AuthStorageContext.Provider>
          </ApolloProvider>
      </NativeRouter>
    </NavigationContainer>
      <StatusBar style='auto' />
    </>
  )
}

export default App

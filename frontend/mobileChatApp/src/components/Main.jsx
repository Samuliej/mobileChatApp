import { View, StyleSheet } from 'react-native'
import NavBar from './NavBar'
import { Route, Routes } from 'react-router-native'
import SignInView from './SignIn'
import Constants from 'expo-constants'
import Feed from './Feed'
import Contacts from './Contacts'
import BottomNav from './BottomNav'
import useGetCurrentUser from '../hooks/useGetCurrentUser'

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1
  }
})

const Main = () => {

  // Check for user before loading /
  // Not signed in -> log in page
  let user = null
  const data = useGetCurrentUser(false)
  user = data && data.user

  return (
    <View style={styles.container}>
        <NavBar />
        <Routes>
          <Route path='/feed' element={<Feed />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/sign-in' element={<SignInView />} exact />
          <>
            {user && (
              <Route path='/' element={<Feed />} exact />
            )}
            {!user && (
              <Route path='/' element={<SignInView />} exact />
            )}
          </>
        </Routes>
        <BottomNav />
    </View>
  )
}

export default Main
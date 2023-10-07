import { View, StyleSheet } from 'react-native'
import NavBar from './NavBar'
import { Route, Routes } from 'react-router-native'
import SignInView from './SignIn'
import Constants from 'expo-constants'
import Feed from './Feed'
import Contacts from './Contacts'
import BottomNav from './BottomNav'

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1
  }
})

const Main = () => {
  return (
    <View style={styles.container}>
        <NavBar />
        <Routes>
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/sign-in' element={<SignInView />} exact />
          <Route path='/' element={<Feed />} exact />
        </Routes>
        <BottomNav />
    </View>
  )
}

export default Main
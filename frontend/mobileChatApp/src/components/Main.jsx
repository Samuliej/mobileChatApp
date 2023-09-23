import { View, StyleSheet } from 'react-native'
import NavBar from './NavBar'
import { Route, Routes } from 'react-router-native'
import SignInView from './SignIn'
import Constants from 'expo-constants'
import Feed from './Feed'

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
          <Route path='/sign-in' element={<SignInView />} exact />
          <Route path='/' element={<Feed />} exact />
        </Routes>
    </View>
  )
}

export default Main
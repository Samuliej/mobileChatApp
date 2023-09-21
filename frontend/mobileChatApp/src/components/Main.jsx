import { View, StyleSheet } from 'react-native'
import NavBar from './NavBar'
import { Route, Routes } from 'react-router-native'
import SignInView from './SignIn'
import Constants from 'expo-constants'

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
        </Routes>
    </View>
  )
}

export default Main
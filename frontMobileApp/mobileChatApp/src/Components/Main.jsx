import React from 'react'
import { View, StyleSheet } from 'react-native'
import FeedScreen from './Feed/index.jsx'
import NavBar from './NavBar/index.jsx'
import { Route, Routes } from 'react-router-native'
import SignIn from './SignIn/index.jsx'
import BottomNavBar from './BottomNav/index.jsx'

const Main = () => {
  return (
    <>
      <NavBar />
      <View style={styles.container}>
        <Routes>
          <Route path="/" element={<FeedScreen />} />
          <Route path="sign-in" element={<SignIn />} />
        </Routes>
      </View>
      <BottomNavBar />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Main
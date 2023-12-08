import React from 'react'
import Constants from 'expo-constants'
import { View, Text, TouchableOpacity as Pressable, StyleSheet } from 'react-native'
import { useNavigate } from 'react-router-native'

const NavBar = () => {
  const navigate = useNavigate()

  return (
    <View style={styles.navBar}>
      <Pressable onPress={() => navigate('/')}>
        <Text style={styles.title}>Mobile Chat App</Text>
      </Pressable>
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={() => navigate('/sign-in')}>
          <Text style={styles.action}>Sign In</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => console.log('Sign up')}>
          <Text style={styles.action}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: Constants.statusBarHeight + 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
    borderRadius: 15
  },
  title: {
    color: '#000',
    fontSize: 20,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#d3d3d3',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  action: {
    color: '#000',
    fontSize: 16,
  },
})

export default NavBar
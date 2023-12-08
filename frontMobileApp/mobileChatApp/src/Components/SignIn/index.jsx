import React, { useState } from 'react'
import { View, StyleSheet, Pressable, Text, TextInput } from 'react-native'
import * as yup from 'yup'
import useSignIn from '../../hooks/useSignIn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorBanner from '../Error/index.jsx'
import { useNavigate } from 'react-router'
import theme from '../../theme'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  button: theme.button,
  buttonText: theme.buttonText,
  showPasswordButton: {
    marginVertical: 10,
  },
  inputBox: theme.inputBox,
})

const usernameSchema = yup.string().required('Username is required.')
const passwordSchema = yup.string().required('Password is required')

const SignIn = () => {
  const { signIn, loading, error } = useSignIn()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validateUsername = async () => {
    const isUsernameValid = await usernameSchema.isValid(username)
    if (!isUsernameValid) {
      setUsernameError('Username is required')
    } else {
      setUsernameError('')
    }
  }

  const validatePassword = async () => {
    const isPasswordValid = await passwordSchema.isValid(password)
    if (!isPasswordValid) {
      setPasswordError('Password is required')
    } else {
      setPasswordError('')
    }
  }

  const handleSignIn = async () => {

    try {
      const data = await signIn(username, password)
      if (data) {
        await AsyncStorage.setItem('userToken', data.authorize.accessToken)
        navigate('/')
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
    console.log('Sign in')
    console.log(username)
    console.log(password)
  }

  if (loading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>fdsjafjidsajifoadsjoafj</Text>
  }

  return (
    <>
      {errorMessage && <ErrorBanner error={errorMessage} />}
      <View style={styles.container}>
        <TextInput style={styles.inputBox}
          value={username}
          onChangeText={setUsername}
          onBlur={validateUsername}
          placeholder='Username'
        />
        {usernameError ? <Text style={{ color: 'red' }}>{usernameError}</Text> : null}
        <TextInput style={styles.inputBox}
          value={password}
          onChangeText={setPassword}
          onBlur={validatePassword}
          placeholder='Password'
          secureTextEntry={true}
        />
        {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
        <Pressable style={styles.button} onPress={handleSignIn}>
          <Text testID='signInButton' style={styles.buttonText}>Sign in</Text>
        </Pressable>
      </View>
    </>
  )
}

export default SignIn
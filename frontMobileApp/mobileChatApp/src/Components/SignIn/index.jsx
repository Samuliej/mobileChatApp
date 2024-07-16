import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Text, Dimensions, ActivityIndicator } from 'react-native'
import * as yup from 'yup'
import useSignIn from '../../hooks/useSignIn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorBanner from '../Error/index.jsx'
import { UserContext } from '../../Context/UserContext'
import { useNavigation } from '@react-navigation/native'
import SignInView from './SignInView/index.jsx'
const height = Dimensions.get('window').height

const validationSchema = yup.object().shape({
  username: yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: yup.string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
})

/**
 * SignIn is a React component that provides a sign-in interface for users.
 * It utilizes a custom hook for sign-in logic, manages form state, and handles navigation upon successful sign-in.
 *
 * Features:
 * - Displays an error banner if sign-in fails.
 * - Shows a loading indicator while signing in.
 * - Validates username and password input against predefined rules.
 * - Navigates to the main screen upon successful sign-in.
 *
 * State:
 * - username: Stores the current value of the username input.
 * - password: Stores the current value of the password input.
 * - usernameError: Stores the error message for the username input.
 * - passwordError: Stores the error message for the password input.
 * - signingIn: Indicates whether the sign-in process is currently happening.
 *
 * Effects:
 * - Clears the sign-in error message after a timeout.
 *
 * Validation:
 * - Uses Yup for schema validation of username and password.
 *
 * Navigation:
 * - Resets the navigation stack to the main screen upon successful sign-in.
 *
 * AsyncStorage:
 * - Stores the user token in AsyncStorage upon successful sign-in.
 *
 * Context:
 * - Uses UserContext to update the user state globally.
 */
const SignIn = () => {
  const { updateUser } = useContext(UserContext)
  const { signIn, error, setError } = useSignIn()
  const navigation = useNavigation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError('')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [error])

  // Function to validate the fields with yup
  const validateField = (field, value) => {
    try {
      yup.reach(validationSchema, field).validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  // Function for handling signing in
  const handleSignIn = async () => {
    const data = await signIn(username, password)
    if (data) {
      setSigningIn(true)
      await AsyncStorage.setItem('userToken', data)
      await updateUser(data)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Home' } }],
      })
      setTimeout(() => {
        setUsername('')
        setPassword('')
        setSigningIn(false)
      }, 2000)
    }
  }

  return (
    <>
      {error && <ErrorBanner error={error} />}
      {signingIn ? (
        <>
          <View style={[styles.container, { marginTop: height / 3, justifyContent: 'center', alignItems: 'center', } ]}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Flying to the Hive...</Text>
          </View>
        </>
      ) : (
        <SignInView username={username} setUsername={setUsername} setUsernameError={setUsernameError}
          password={password} setPassword={setPassword} setPasswordError={setPasswordError}
          handleSignIn={handleSignIn} usernameError={usernameError} passwordError={passwordError}
          validateField={validateField} />
      )}
    </>
  )

}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
})

export default SignIn
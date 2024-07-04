import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Text, TextInput, Dimensions, Image, ActivityIndicator } from 'react-native'
import * as yup from 'yup'
import useSignIn from '../../hooks/useSignIn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorBanner from '../Error/index.jsx'
import theme from '../../theme'
import { UserContext } from '../../Context/UserContext'
import { useNavigation } from '@react-navigation/native'
import CustomButton from './CustomButton.jsx'
const height = Dimensions.get('window').height
// Sign in icon from:
// <a href="https://www.flaticon.com/free-icons/honeycomb" title="honeycomb icons">Honeycomb icons created by PIXARTIST - Flaticon</a>
const icon = require('../../../assets/honeycomb.png')

const validationSchema = yup.object().shape({
  username: yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: yup.string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
})

/**
 * This is the Sign In component of the application.
 *
 * It uses several hooks and contexts:
 * - `useSignIn` hook: This custom hook provides the functionality to sign in the user.
 * - `AsyncStorage`: Used to store the user token persistently.
 * - `UserContext`: This context provides the current user state and a function to update it.
 * - `useNavigate`: This hook from 'react-router' is used to programmatically navigate the user.
 *
 * The component contains a form with two fields: username and password. Both fields have validation schemas using `yup`.
 *
 * When the user submits the form, the `handleSignIn` function is called. This function calls the `signIn` function from the `useSignIn` hook with the username and password. If the sign in is successful, it stores the user token in `AsyncStorage`, updates the user context, and navigates the user to the main page.
 *
 * The component also includes an `ErrorBanner` component to display any error that might occur while signing in.
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


// Sign in view component
const SignInView = ({ username, setUsername, password, setUsernameError, setPasswordError,
  setPassword, handleSignIn, usernameError, passwordError, validateField }) => {
  const navigation = useNavigation()

  return (
    <>
      <View style={[styles.container, { marginTop: height/7 }]}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={icon}
            style={{ width: 90, height: 90 }}
          />
        </View>
        <TextInput
          style={styles.inputBox}
          value={username}
          onChangeText={setUsername}
          onBlur={() => {
            const trimmedUsername = username.trim()
            setUsername(trimmedUsername)
            const errorMessage = validateField('username', trimmedUsername)
            if (errorMessage) {
              setUsernameError(errorMessage)
              setTimeout(() => {
                setUsernameError('')
              }, 3500)
            } else {
              setUsernameError('')
            }
          }}
          placeholder='Username'
        />
        {usernameError ? <Text style={{ color: 'red' }}>{usernameError}</Text> : null}
        <TextInput
          style={styles.inputBox}
          value={password}
          onChangeText={setPassword}
          onBlur={() => {
            const trimmedPassword = password.trim()
            setPassword(trimmedPassword)
            const errorMessage = validateField('password', trimmedPassword)
            if (errorMessage) {
              setPasswordError(errorMessage)
              setTimeout(() => {
                setPasswordError('')
              }, 3500)
            } else {
              setPasswordError('')
            }
          }}
          placeholder='Password'
          secureTextEntry={true}
        />
        {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
        <CustomButton style={{ marginTop: 10 }} onPress={handleSignIn} title='Sign in' />
        <Text style={{ marginBottom: 10, marginTop: 30, textAlign: 'center' }}>{"Don't have an account?"}</Text>
        <CustomButton title='Register' style={{ backgroundColor: 'black' }}
          onPress={() => navigation.navigate('SignUp')} />
      </View>
    </>
  )
}

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

export default SignIn
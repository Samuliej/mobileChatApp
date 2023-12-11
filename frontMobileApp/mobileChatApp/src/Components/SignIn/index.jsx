import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Pressable, Text, TextInput, Dimensions } from 'react-native'
import * as yup from 'yup'
import useSignIn from '../../hooks/useSignIn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorBanner from '../Error/index.jsx'
import theme from '../../theme'
import { UserContext } from '../../Context/UserContext'
import { useNavigation } from '@react-navigation/native'
const height = Dimensions.get('window').height



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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError('')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [error])

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
    const data = await signIn(username, password)
    if (data) {
      await AsyncStorage.setItem('userToken', data)
      await updateUser(data)
      navigation.navigate('Feed')
    }
  }

  return (
    <>
      {error && <ErrorBanner error={error} />}
      <SignInView username={username} setUsername={setUsername} validateUsername={validateUsername}
        password={password} setPassword={setPassword} validatePassword={validatePassword}
        handleSignIn={handleSignIn} usernameError={usernameError} passwordError={passwordError}/>
    </>
  )

}

const SignInView = ({ username, setUsername, validateUsername, password,
  setPassword, validatePassword, handleSignIn, usernameError, passwordError }) => {
  const navigation = useNavigation()

  return (
    <>
      <View style={[styles.container, { marginTop: height/5 }]}>
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
        <Text style={{ marginTop: 30, textAlign: 'center' }}>Don't have an account?</Text>
        <Pressable style={styles.button}
          onPress={() => navigation.navigate('SignUp')}

        >
          <Text testID='signUpButton' style={styles.buttonText}>Sign up</Text>
        </Pressable>
      </View>
    </>
  )
}

export default SignIn
import React, { useState, useContext, useEffect } from 'react'
import { Dimensions, View, Pressable, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import CustomButton from '../SignIn/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native'
import ErrorBanner from '../Error/index.jsx'
import { UserContext } from '../../Context/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useIsUsernameTaken from '../../hooks/useIsUsernameTaken'
import useSignUpForm from '../../hooks/useSignUpForm.js'
import TextInputField from './TextInputField/index.jsx'


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

/**
 * SignUp is a React component that provides a user interface for signing up a new user.
 * It utilizes various hooks and components to manage form state, input validation, and navigation.
 *
 * Features:
 * - Utilizes `useSignUpForm` custom hook for managing form state and validation.
 * - Uses `useIsUsernameTaken` custom hook to check if the username is already taken.
 * - Integrates with `UserContext` for updating user state upon successful sign up.
 * - Provides visual feedback during the sign-up process with loading indicators and error messages.
 * - Supports image selection for profile pictures with feedback on selection and option to remove.
 * - Uses `TextInputField` for input fields with validation feedback.
 * - Navigates to the main application screen upon successful sign-up and sign-in.
 *
 * Behavior:
 * - Validates input fields onBlur and before attempting to sign up.
 * - Checks if the username is taken as the user types.
 * - Displays error messages for individual input fields and general sign-up errors.
 * - Shows a loading indicator while signing up.
 * - Resets navigation stack upon successful sign-up to prevent going back to the sign-up screen.
 *
 * Usage:
 * - Should be used within a navigation stack that supports navigation to the 'Main' screen.
 * - Requires `UserContext` to be available in the component tree for updating user state.
 *
 * Props: None
 */
const SignUp = () => {
  const form = useSignUpForm()
  const { updateUser } = useContext(UserContext)
  const [errorMessage, setErrorMessage] = useState('')
  const navigation = useNavigation()
  const [ signingUp, setSigningUp ] = useState(false)
  const { isLoading, isTaken, check } = useIsUsernameTaken()

  useEffect(() => {
    if (form.signUpError) {
      setErrorMessage(form.signUpError)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    } else if (form.signInError) {
      setErrorMessage(form.signInError)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }, [form.signUpError, form.signInError])

  useEffect(() => {
    if (form.loading) {
      setSigningUp(true)
    }

    const timeout = setTimeout(() => {
      setSigningUp(false)
    }, 5000)

    clearTimeout(timeout)
  }, [form.loading])


  // Handle signing up
  const handleSignUp = async () => {
    if ((form.passwordsMatch && !form.usernameError && !form.passwordError && !form.nameError)
        && (form.username && form.password && form.name && form.confirmPassword)) {

      // Sign up the new user
      const user = await form.signUp(form.username, form.password, form.name, form.profilePicture, form.phone, form.city)
      if (user) {
        // If user created, sign in
        const data = await form.signIn(form.username, form.password)
        if (data) {
          await AsyncStorage.setItem('userToken', data)
          await updateUser(data)
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main', params: { screen: 'Home' } }],
          })
        }
      } else {
        console.log('Sign up failed')
      }
    }  else {
      setErrorMessage('Some of the required fields are missing or invalid.')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={true}
    >
      {signingUp ? (
        <>
          <View style={[styles.container, { marginTop: height / 3, justifyContent: 'center', alignItems: 'center', } ]}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Flying to the Hive...</Text>
          </View>
        </>
      ) : (<View>
        {errorMessage && <ErrorBanner error={errorMessage} />}
        <Pressable style={styles.imagePicker} onPress={form.selectImage}>
          {form.image ? (
            <>
              <Image source={{ uri: form.image }} style={styles.image} />
              <Pressable style={styles.deleteButton} onPress={form.deleteImage}>
                <Text style={styles.deleteButtonText}>x</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.imagePickerText}>+</Text>
          )}
        </Pressable>
        <Text style={styles.title}>Username and password</Text>
        <Text style={{ marginBottom: 24 }}>Starred(*) fields are required</Text>
        <TextInputField
          label={"Username:*"}
          value={form.username}
          onChangeText={form.setUsername}
          onBlur={async () => {
            const trimmedUsername = form.username.trim()
            form.setUsername(trimmedUsername)
            const errorMessage = form.validateField('username', { username: form.username })
            if (errorMessage) {
              form.setUsernameError(errorMessage)
              setTimeout(() => {
                form.setUsernameError('')
              }, 3500)
            }
            await check(trimmedUsername)
          }}
          placeholder={'Username (min. 3 characters)'}
        />
        {isTaken ? <Text style={{ color: 'red' }}>Username is taken</Text> : null}
        {!isTaken && !isLoading && form.username !== '' ? <Text style={{ color: 'green' }}>Username is available</Text> : null}
        {form.usernameError ? <Text style={{ color: 'red' }}>{form.usernameError}</Text> : null}

        <TextInputField
          textMargin={{marginTop: 16}}
          label={"Password:*"}
          value={form.password}
          onChangeText={form.setPassword}
          onBlur={() => {
            const trimmedPassword = form.password.trim()
            form.setPassword(trimmedPassword)
            const errorMessage = form.validateField('password', { password: form.password })
            if (errorMessage) {
              form.setPasswordError(errorMessage)
              setTimeout(() => {
                form.setPasswordError('')
              }, 3500)
            }
          }}
          placeholder={'Password (min. 5 characters)'}
          secureTextEntry={true}
        />
        {form.passwordError ? <Text style={{ color: 'red' }}>{form.passwordError}</Text> : null}

        <TextInputField
          textMargin={{marginTop: 16}}
          label={"Confirm password:*"}
          value={form.confirmPassword}
          onChangeText={form.setConfirmPassword}
          onBlur={() => {
            const trimmedConfirmPassword = form.confirmPassword.trim()
            form.setConfirmPassword(trimmedConfirmPassword)
            const errorMessage = form.validateConfirmPassword(form.password, trimmedConfirmPassword)
            if (errorMessage) {
              form.setPasswordsMatch(false)
            } else {
              form.setPasswordsMatch(true)
            }
          }}
          placeholder={'Confirm Password'}
          secureTextEntry={true}
        />
        {form.passwordsMatch !== null && !form.passwordsMatch ? <Text style={{ color: 'red' }}>{'Passwords must match'}</Text> : null}
        {form.passwordsMatch ? <Text style={{ color: 'green' }}>{'Passwords match!'}</Text> : null}


        <Text style={[{ marginTop: 26 }, styles.title]}>Additional information</Text>
        <TextInputField
          textMargin={{marginTop: 16}}
          label={"Name:*"}
          value={form.name}
          onChangeText={form.setName}
          onBlur={() => {
            const trimmedName = form.name.trim()
            form.setName(trimmedName)
            const errorMessage = form.validateField('name', { name: form.name })
            if (errorMessage) {
              form.setNameError(errorMessage)
              setTimeout(() => {
                form.setNameError('')
              }, 3500)
            } else {
              form.setNameError('')
            }
          }}
          placeholder={'Name (min. 3 characters)'}
        />
        {form.nameError? <Text style={{ color: 'red' }}>{form.nameError}</Text> : null}

        <TextInputField
          textMargin={{marginTop: 16}}
          label={"Phone:"}
          value={form.phone}
          onChangeText={form.setPhone}
          onBlur={() => {
            const trimmedPhone = form.phone.trim()
            form.setPhone(trimmedPhone)
          }}
          placeholder={'Phone'}
          keyboardType={'phone-pad'}
        />

        <TextInputField
          textMargin={{marginTop: 16}}
          label={"City:"}
          value={form.city}
          onChangeText={form.setCity}
          onBlur={() => {
            const trimmedCity = form.city.trim()
            form.setCity(trimmedCity)
          }}
          placeholder={'City'}
        />
        <CustomButton style={{ marginTop: 10, marginBottom: 20 }} onPress={handleSignUp} title='Register' />
      </View>)}
    </KeyboardAwareScrollView>
  )
}


// Styles

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    marginLeft: width/3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePickerText: {
    fontSize: 50,
    color: '#008000',
    position: 'absolute',
    right: 5,
    bottom: -10,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontWeight: 'bold',
  }
})

export default SignUp
import React, { useState, useContext, useEffect } from 'react'
import { Dimensions, View, Pressable, Text, TextInput, Image, StyleSheet, ActivityIndicator } from 'react-native'
import CustomButton from '../SignIn/CustomButton'
import useSignUp from '../../hooks/useSignUp'
import * as ImagePicker from 'expo-image-picker'
import * as yup from 'yup'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native'
import ErrorBanner from '../Error/index.jsx'
import useSignIn from '../../hooks/useSignIn'
import { UserContext } from '../../Context/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useIsUsernameTaken from '../../hooks/useIsUsernameTaken'


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
  name: yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
})

const SignUp =  () => {
  const { signUp, error: signUpError, loading } = useSignUp()
  const { signIn, error: signInError } = useSignIn()
  const { updateUser } = useContext(UserContext)
  const { isLoading, isTaken, check } = useIsUsernameTaken()
  const [ signingUp, setSigningUp ] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const navigation = useNavigation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [nameError, setNameError] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(null)

  const [image, setImage] = useState(null)

  useEffect(() => {
    if (signUpError) {
      setErrorMessage(signUpError)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    } else if (signInError) {
      setErrorMessage(signInError)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }, [signUpError, signInError])

  useEffect(() => {
    if (loading) {
      setSigningUp(true)
    }

    const timeout = setTimeout(() => {
      setSigningUp(false)
    }, 5000)

    clearTimeout(timeout)
  }, [loading])

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setImage(result.uri)
      let localUri = result.uri
      let filename = localUri.split('/').pop()

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename)
      let type = match ? `image/${match[1]}` : `image`
      setProfilePicture({ uri: localUri, name: filename, type })
    }
  }

  const validateField = (field, values) => {
    try {
      yup.reach(validationSchema, field).validateSync(values[field])
    } catch (error) {
      return error.message
    }
  }

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Passwords don't match."
    }
  }

  const handleSignUp = async () => {
    if ((passwordsMatch && !usernameError && !passwordError && !nameError)
        && (username && password && name && confirmPassword)) {

      // Sign up the new user
      const user = await signUp(username, password, name, profilePicture, phone, city)
      if (user) {
        // If user created, sign in
        const data = await signIn(username, password)
        if (data) {
          await AsyncStorage.setItem('userToken', data)
          await updateUser(data)
          navigation.navigate('Main', { screen: 'Home' })
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

  // TODO: maybe create component for displaying text input and errors
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
      ) : (
        <View>
          {errorMessage && <ErrorBanner error={errorMessage} />}
          <Pressable style={styles.imagePicker} onPress={selectImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.imagePickerText}>+</Text>
            )}
          </Pressable>
          <Text style={styles.title}>Choose your username</Text>
          <Text style={{ marginBottom: 24 }}>Starred(*) fields are required</Text>
          <Text>Username:*</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            onBlur={async () => {
              const errorMessage = validateField('username', { username })
              if (errorMessage) {
                setUsernameError(errorMessage)
                setTimeout(() => {
                  setUsernameError('')
                }, 3500)
              }
              await check(username)
            }}
            placeholder='Username (min. 3 characters)'
          />
          {isTaken ? <Text style={{ color: 'red' }}>Username is taken</Text> : null}
          {!isTaken && !isLoading ? <Text style={{ color: 'green' }}>Username is available</Text> : null}
          {usernameError ? <Text style={{ color: 'red' }}>{usernameError}</Text> : null}
          <Text style={{ marginTop: 16 }}>Password:*</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            onBlur={() => {
              const errorMessage = validateField('password', { password })
              if (errorMessage) {
                setPasswordError(errorMessage)
                setTimeout(() => {
                  setPasswordError('')
                }, 3500)
              }
            }}
            secureTextEntry
            placeholder='Password (min. 5 characters)'
          />
          {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
          <Text style={{ marginTop: 16 }}>Confirm Password:*</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => {
              const errorMessage = validateConfirmPassword(password, confirmPassword)
              if (errorMessage) {
                setPasswordsMatch(false)
              } else {
                setPasswordsMatch(true)
              }
            }}
            secureTextEntry
            placeholder='Confirm Password'
          />
          {passwordsMatch !== null && !passwordsMatch ? <Text style={{ color: 'red' }}>{'Passwords must match'}</Text> : null}
          {passwordsMatch ? <Text style={{ color: 'green' }}>{'Passwords match!'}</Text> : null}
          <Text style={{ marginBottom: 10 }} />
          <Text style={styles.title}>Additional information</Text>
          <Text>Name:*</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            onBlur={() => {
              const errorMessage = validateField('name', { name })
              if (errorMessage) {
                setNameError(errorMessage)
                setTimeout(() => {
                  setNameError('')
                }, 3500)
              } else {
                setNameError('')
              }
            }}
            placeholder='Name (min. 3 characters)'
          />
          {nameError? <Text style={{ color: 'red' }}>{nameError}</Text> : null}
          <Text style={{ marginTop: 16 }}>Phone:</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder='Phone'
            keyboardType='phone-pad'
          />
          <Text style={{ marginTop: 16 }}>City:</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder='City'
          />
          <CustomButton style={{ marginTop: 10, marginBottom: 20 }} onPress={handleSignUp} title='Register' />
        </View>
      )}
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
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
})

export default SignUp
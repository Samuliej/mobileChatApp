import React, { useState } from 'react'
import { Dimensions, View, Pressable, Text, TextInput, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import CustomButton from '../SignIn/CustomButton'
import * as ImagePicker from 'expo-image-picker'
import * as yup from 'yup'

const width = Dimensions.get('window').width

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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [nameError, setNameError] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(null)

  const [image, setImage] = useState(null)

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      setProfilePictureUrl(result.assets[0].uri)
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

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.")
      return
    }

    // Sign up logic here
    console.log('Sign Up')
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View>
          <Pressable style={styles.imagePicker} onPress={selectImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.imagePickerText}>+</Text>
            )}
          </Pressable>
          <Text style={styles.title}>Choose your username</Text>
          <Text>Username:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            onBlur={() => {
              const errorMessage = validateField('username', { username })
              if (errorMessage) {
                setUsernameError(errorMessage)
                setTimeout(() => {
                  setUsernameError('')
                }, 3500)
              }
            }}
            placeholder='Username'
          />
          {usernameError ? <Text style={{ color: 'red' }}>{usernameError}</Text> : null}
          <Text style={{ marginTop: 16 }}>Password:</Text>
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
            placeholder='Password'
          />
          {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
          <Text style={{ marginTop: 16 }}>Confirm Password:</Text>
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
          <Text>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            onBlur={() => {
              const errorMessage = validateField('name', name)
              if (errorMessage) {
                setNameError(errorMessage)
                setTimeout(() => {
                  setNameError('')
                }, 3500)
              } else {
                setNameError('')
              }
            }}
            placeholder='Name'
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
          <CustomButton style={{ marginTop: 10 }} onPress={handleSignUp} title='Register' />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
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
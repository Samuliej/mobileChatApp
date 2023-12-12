import React, { useState } from 'react'
import { Pressable, Text, TextInput, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import CustomButton from '../SignIn/CustomButton'
import { launchImageLibrary } from 'react-native-image-picker'



const SignUp = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [profilePicture, setProfilePicture] = useState('')

  const [image, setImage] = useState(null)

  const selectImage = () => {
    const options = {
      noData: true,
    }

    launchImageLibrary(options, response => {
      if (response.assets && response.assets[0].uri) {
        setImage(response.assets[0].uri)
      }
    })
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
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
          placeholder='Username'
        />
        <Text>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder='Password'
        />
        <Text>Confirm Password:</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder='Confirm Password'
        />
        <Text style={styles.title}>Additional information</Text>
        <Text>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder='Name'
        />
        <Text>Phone:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder='Phone'
          keyboardType='phone-pad'
        />
        <Text>City:</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder='City'
        />
        <Text>Profile Picture URL:</Text>
        <TextInput
          style={styles.input}
          value={profilePicture}
          onChangeText={setProfilePicture}
          placeholder='Profile Picture URL'
        />
        <CustomButton onPress={handleSignUp} title='Register' />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 16,
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
    marginTop: 50
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePickerText: {
    fontSize: 50,
  },
})

export default SignUp
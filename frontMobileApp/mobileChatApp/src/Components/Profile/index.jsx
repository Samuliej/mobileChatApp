import React, { useContext, useState, useEffect } from 'react'
import { View, Text, Image, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { UserContext } from '../../Context/UserContext'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../SignIn/CustomButton'
import ErrorBanner from '../Error/index'
import * as ImagePicker from 'expo-image-picker'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon
import defaultProfilePicture from '../../../assets/soldier.png'

const Profile = () => {
  const { user, updateUserFields, loading } = useContext(UserContext)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [city, setCity] = useState(user.city)
  const [notif, setNotif] = useState('')
  const [image, setImage] = useState(user.profilePicture)
  const [newProfilePicture, setNewProfilePicture] = useState(null)

  // Function for selecting an image to upload
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.uri)
      let localUri = result.uri
      let filename = localUri.split('/').pop()

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename)
      let type = match ? `image/${match[1]}` : `image`
      setNewProfilePicture({ uri: localUri, name: filename, type })
    }
  }

  const toggleEditMode = () => {
    // User doesn't save, revert back to original info
    if (editMode) {
      setName(user.name)
      setPhone(user.phone)
      setCity(user.city)
      setImage(user.profilePicture)
      setNewProfilePicture(null)
      setEditMode(!editMode)
    }
    else setEditMode(!editMode)
  }

  const handleSave = async () => {
    updateUserFields(name, phone, city, newProfilePicture)
    setEditMode(false)
    setNotif('Profile updated')
  }

  useEffect(() => {
    if (notif) {
      const timeout = setTimeout(() => {
        setNotif('')
      }, 3000)

      return () => clearTimeout(timeout)
    }
  },[notif])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Updating profile...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {notif && (
        <ErrorBanner error={notif} type={'success'} />
      )}
      <Pressable style={styles.editIcon} onPress={toggleEditMode}>
        <Ionicons name="settings-outline" size={30} color="#000" />
      </Pressable>
      {editMode ? (
        <Pressable style={styles.imageContainer} onPress={selectImage}>
          <Image source={image ? { uri: image } : defaultProfilePicture} style={styles.image} />
          <View style={styles.iconContainer}>
            <Ionicons name="create-outline" size={24} color="white" />
          </View>
        </Pressable>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture} style={styles.image} />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{user.username}</Text>
        {editMode ? (
          <View>
            <Text>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
            <Text>Phone</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" />
            <Text>City</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />
            <CustomButton style={{ marginTop: 10, marginBottom: 20 }} onPress={handleSave} title='Save' />
          </View>
        ) : (
          <>
            <Text style={styles.infoText}>Username: {user.username}</Text>
            <Text style={styles.infoText}>Name: {user.name}</Text>
            <Text style={styles.infoText}>Phone: {user.phone}</Text>
            <Text style={styles.infoText}>City: {user.city}</Text>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center'
  },
  infoText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    fontSize: 18,
    marginBottom: 12,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Profile
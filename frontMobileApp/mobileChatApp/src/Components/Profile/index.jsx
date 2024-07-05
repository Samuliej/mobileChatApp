import React, { useContext, useState, useEffect } from 'react'
import { View, Text, Image, TextInput, StyleSheet, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { UserContext } from '../../Context/UserContext'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../SignIn/CustomButton'
import ErrorBanner from '../Error/index'
import usePost from '../../hooks/usePost'
import useUserPosts from '../../hooks/useUserPosts'
import * as ImagePicker from 'expo-image-picker'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon
import defaultProfilePicture from '../../../assets/soldier.png'
import FriendPost from '../Friends/Friend/FriendPost'

const Profile = ({ navigation }) => {
  const { user, updateUserFields, loading } = useContext(UserContext)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [city, setCity] = useState(user.city)
  const [notif, setNotif] = useState('')
  const [image, setImage] = useState(user.profilePicture)
  const [newProfilePicture, setNewProfilePicture] = useState(null)
  const [currentView, setCurrentView] = useState('info')
  const { likePost, commentPost } = usePost()
  const { userPosts, refreshUserPosts } = useUserPosts(user._id)

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('refreshing posts')
      refreshUserPosts()
    })

    return unsubscribe
  }, [navigation])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Updating profile...</Text>
      </View>
    )
  }


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          {notif && (
            <ErrorBanner error={notif} type={'success'} />
          )}
          <View style={{ alignItems: 'center' }}>
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
          </View>

          <View>
            <Text style={styles.title}>{user.username}</Text>
            {editMode && (
              <View>
                <View style={{ alignItems: 'center' }}>
                  <Text>Name</Text>
                  <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
                  <Text>Phone</Text>
                  <TextInput style={styles.input} value={phone} keyboardType='phone-pad' onChangeText={setPhone} placeholder="Phone" />
                  <Text>City</Text>
                  <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />
                </View>
                <CustomButton style={{ marginTop: 10, marginBottom: 20, marginHorizontal: 50 }} onPress={handleSave} title='Save' />
              </View>
            )}
            {!editMode && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <Pressable
                  onPress={() => setCurrentView('info')}
                  style={{
                    flex: 1,
                    backgroundColor: currentView === 'info' ? '#4CAF50' : '#f8f9fa',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    borderRadius: 1,
                    borderBottomWidth: 1,
                    borderColor: 'black',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Text style={{ color: currentView === 'info' ? '#ffffff' : '#000000' }}>User Info</Text>
                </Pressable>
                <Pressable
                  onPress={() => setCurrentView('posts')}
                  style={{
                    flex: 1,
                    backgroundColor: currentView === 'posts' ? '#4CAF50' : '#f8f9fa',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    borderRadius: 1,
                    borderBottomWidth: 1,
                    borderColor: 'black',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Text style={{ color: currentView === 'posts' ? '#ffffff' : '#000000' }}>Posts</Text>
                </Pressable>
              </View>
            )}
            {(currentView === 'info' && !editMode) &&(
              <View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>Username: {user.username}</Text>
                  <Text style={styles.infoText}>Name: {user.name}</Text>
                  <Text style={styles.infoText}>Phone: {user.phone}</Text>
                  <Text style={styles.infoText}>City: {user.city}</Text>
                </View>
              </View>
            )}
          </View>
          <View>
            {(currentView === 'posts' && !editMode) && userPosts.map(post =>
              <FriendPost key={post._id} post={post} likePost={likePost} commentPost={commentPost} />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
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
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginHorizontal: 20,
    marginTop: 20,
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
    color: 'black',
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
  },
})

export default Profile
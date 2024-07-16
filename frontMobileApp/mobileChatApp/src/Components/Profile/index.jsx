import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { UserContext } from '../../Context/UserContext'
import usePost from '../../hooks/usePost'
import useUserPosts from '../../hooks/useUserPosts'
import * as ImagePicker from 'expo-image-picker'
import ProfileContainer from './ProfileContainer/index'


/**
 * Profile is a React component that renders the user's profile page, including the profile information and posts.
 * It allows the user to edit their profile information and select a new profile picture.
 *
 * Props:
 * - navigation: The navigation prop passed from React Navigation, used to listen for navigation events.
 *
 * State:
 * - editMode: Boolean indicating if the profile is in edit mode.
 * - name, phone, city: Strings representing the user's name, phone number, and city. Initially set from the user context.
 * - notif: String for displaying notifications like successful profile update.
 * - image: URI of the current profile picture. Initially set from the user context.
 * - newProfilePicture: Object representing the new profile picture selected by the user, null if no new picture is selected.
 * - currentView: String indicating the current view ('info' or 'posts') within the profile.
 *
 * Hooks:
 * - useContext(UserContext): To access and manipulate the user's information.
 * - useState: To manage local state for edit mode, user information, notification, profile picture, and current view.
 * - useEffect: To handle side effects like setting a timeout for notifications and refreshing posts when the profile is focused.
 *
 * Functions:
 * - selectImage: Asynchronously opens the image picker for the user to select a new profile picture.
 * - toggleEditMode: Toggles the edit mode on or off. Resets user information if edit mode is turned off without saving.
 * - handleSave: Asynchronously updates the user's information with the new values and profile picture.
 *
 * Behavior:
 * - Displays an activity indicator and a message while updating the profile.
 * - Renders the ProfileContainer component, passing all necessary props and state to it.
 * - Handles keyboard behavior for iOS and Android differently using KeyboardAvoidingView.
 *
 */
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

  /**
 * Toggles the edit mode and resets the user's information if the edit mode is currently on.
 *
 * @return {void}
 */
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

  // Refresh the posts when the user navigates back to profile
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
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
      <ProfileContainer
        notif={notif}
        toggleEditMode={toggleEditMode}
        editMode={editMode}
        selectImage={selectImage}
        image={image}
        user={user}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        city={city}
        setCity={setCity}
        handleSave={handleSave}
        currentView={currentView}
        setCurrentView={setCurrentView}
        userPosts={userPosts}
        likePost={likePost}
        commentPost={commentPost}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Profile
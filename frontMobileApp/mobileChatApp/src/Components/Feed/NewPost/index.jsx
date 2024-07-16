import React, { useState, useContext } from 'react'
import { UserContext } from '../../../Context/UserContext'
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Text, Image } from 'react-native'
import usePost from '../../../hooks/usePost'
import * as ImagePicker from 'expo-image-picker'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'


/**
 * NewPost is a React component for creating a new post with optional image attachment in a social media application.
 *
 * Props:
 * - navigation: Object. The navigation prop provided by React Navigation, used for navigating between screens.
 *
 * State:
 * - content: String. The text content of the new post.
 * - image: Object|null. The selected image for the post, or null if no image is selected.
 * - creatingPost: Boolean. Indicates whether a post is currently being created (true) or not (false).
 *
 * Hooks:
 * - useState: To manage component states (content, image, creatingPost).
 * - useContext: To access the current user's context.
 * - usePost: A custom hook that provides the createPost function to create a new post.
 *
 * Functions:
 * - selectImage: Asynchronously opens the image library for the user to select an image. Sets the image state with the selected image's URI, type, and name.
 * - removeImage: Sets the image state to null, effectively removing the selected image.
 * - handleCreatePost: Asynchronously creates a new post using the createPost function from usePost hook. Resets content and image states and navigates back on success.
 *
 * Rendering:
 * - Displays a loading indicator and message when creatingPost is true.
 * - Otherwise, renders the UI for creating a new post, including:
 *   - An optional image preview with a remove button if an image is selected.
 *   - A TextInput for the post's text content.
 *   - Buttons for selecting an image and posting.
 */
const NewPost = ({ navigation }) => {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const { createPost } = usePost()
  const user = useContext(UserContext)
  const [creatingPost, setCreatingPost] = useState(false)

  // Handles image selection
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      let localUri = result.uri
      let filename = localUri.split('/').pop()

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename)
      let type = match ? `image/${match[1]}` : `image`

      setImage({
        uri: localUri,
        type: type,
        name: filename,
      })
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  const handleCreatePost = async () => {
    setCreatingPost(true)
    const post = await createPost(content, image, user)
    setCreatingPost(false)
    if (post) {
      setContent('')
      setImage(null)
      navigation.goBack()
    }
  }

  if (creatingPost) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Uploading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
            <MaterialIcons name="remove-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
          <Ionicons name="ios-images" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={handleCreatePost}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 200,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  imageContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageButton: {
    backgroundColor: '#A9A9A9',
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 15,
    flex: 0.48,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default NewPost
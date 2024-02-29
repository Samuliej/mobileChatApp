import React, { useState, useContext } from 'react'
import { UserContext } from '../../../Context/UserContext'
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Text, Image, Dimensions } from 'react-native'
import usePost from '../../../hooks/usePost'
import * as ImagePicker from 'expo-image-picker'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'

const NewPost = ({ navigation }) => {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const { createPost } = usePost()
  const user = useContext(UserContext)
  const [creatingPost, setCreatingPost] = useState(false)

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
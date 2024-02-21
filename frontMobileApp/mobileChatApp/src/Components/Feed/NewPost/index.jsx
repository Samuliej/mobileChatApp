import React, { useState, useContext } from 'react'
import { UserContext } from '../../../Context/UserContext'
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Text, Dimensions } from 'react-native'
import usePost from '../../../hooks/usePost'
import * as ImagePicker from 'expo-image-picker'

const height = Dimensions.get('window').height

const NewPost = ({ navigation }) => {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const { createPost } = usePost()
  const user = useContext(UserContext)
  const [creatingPost, setCreatingPost] = useState(false)

  console.log('user', user)

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

  const handleCreatePost = async () => {
    setCreatingPost(true)
    const post = await createPost(content, image, user)
    setCreatingPost(false)
    if (post) {
      navigation.goBack()
    }
  }

  if (creatingPost) {
    return (
      <View style={[styles.container, { marginTop: height / 3, justifyContent: 'center', alignItems: 'center', } ]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Uploading...</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Select Image" onPress={selectImage} />
      <Button title="Post" onPress={handleCreatePost} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
})

export default NewPost
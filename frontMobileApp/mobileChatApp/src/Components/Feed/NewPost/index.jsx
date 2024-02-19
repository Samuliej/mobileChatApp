import React, { useState, useContext } from 'react'
import { UserContext } from '../../../Context/UserContext'

import { View, TextInput, Button, StyleSheet } from 'react-native'
import usePost from '../../../hooks/usePost'

const NewPost = ({ navigation }) => {
  const [content, setContent] = useState('')
  const { createPost } = usePost()
  const user = useContext(UserContext)

  const handleCreatePost = async () => {
    const post = await createPost({ text: content, image: null }, user)
    if (post) {
      navigation.goBack()
    }
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
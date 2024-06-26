import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, Image, Button, Animated, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const FriendPost = ({ post: initialPost, likePost, commentPost }) => {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [post, setPost] = useState(initialPost)
  const likeScale = useRef(new Animated.Value(1)).current

  const handleCommentSubmit = async () => {
    if (commentText) {
      const newComment = await commentPost(post._id, commentText)
      if (newComment) {
        setPost(prevPost => ({
          ...prevPost,
          comments: [...prevPost.comments, newComment]
        }))
        setCommentText('')
      } else {
        console.log('Error commenting post')
      }
    }
  }

  const handleLike = async () => {
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    const success = await likePost(post._id)

    if (success) {
      setPost(prevPost => ({
        ...prevPost,
        likes: prevPost.likes + 1
      }))
    }
  }

  return (
    <View key={post._id} style={styles.postContainer}>
      {post.content.image && (
        <Image
          style={styles.postImage}
          source={{ uri: post.content.image }}
        />
      )}
      <View style={styles.textContainer}>
        <Text>{post.content.text}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <View style={styles.likeContainer}>
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <Ionicons name="thumbs-up-outline" size={24} color="black" onPress={handleLike} />
          </Animated.View>
          <Text>{post.likes}</Text>
        </View>
        <View style={styles.commentContainer}>
          {post.comments.length > 0 && <Text>{post.comments.length}</Text>}
          <Ionicons name="chatbubble-outline" size={24} color="black" onPress={() => setCommentsOpen(!commentsOpen)} />
        </View>
      </View>
      {commentsOpen && (
        <View style={styles.commentsSection}>
          {post.comments.map((comment) => (
            <View key={comment._id} style={styles.commentContainer}>
              <Text style={styles.commentUser}>{comment.user.username}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))}
          <TextInput
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <Button title="Submit" onPress={handleCommentSubmit} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  postContainer: {
    width: '95%',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  textContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
})

export default FriendPost
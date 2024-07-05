import React, { useState, useRef } from 'react'
import { TextInput, View, Text, StyleSheet, Image, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon
import defaultProfilePicture from '../../../../assets/soldier.png'
import CustomButton from '../../SignIn/CustomButton'

/*

  Component for displaying a single uploaded post
  There are options for liking and commenting the post.

*/


const Post = ({ post: initialPost, likePost, commentPost, user }) => {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [post, setPost] = useState(initialPost)
  const likeScale = useRef(new Animated.Value(1)).current
  const [justLiked, setJustLiked] = useState(false)

  // Handles submitting a new comment to a post
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

  // Handles liking the post, also animates the icon
  const handleLike = async () => {
    if (!post.likedBy.includes(user._id) || justLiked) {
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
    }

    const success = await likePost(post._id)

    if (success) {
      setPost(prevPost => ({
        ...prevPost,
        likes: prevPost.likes + 1
      }))
      setJustLiked(true)
    }
  }

  return (
    <View key={post._id} style={styles.postContainer}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.profilePicture}
          source={
            post.author && post.author._id === user.id
              ? { uri: user.profilePicture } : post.author && post.author.profilePicture
                ? { uri: post.author.profilePicture } : defaultProfilePicture
          }
        />
        <Text style={styles.username}>
          {post.author && post.author._id === user.id ? user.username : post.author.username}
        </Text>
      </View>
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
            <Ionicons
              name="thumbs-up-outline"
              size={24}
              color={(post.likedBy.includes(user._id) || justLiked) ? "blue" : "black"}
              onPress={handleLike}
            />
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
          <CustomButton style={{ marginTop: 10, marginBottom: 5 }} onPress={handleCommentSubmit} title='Submit' />
        </View>
      )}
    </View>
  )
}

// Styles

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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    color: '#333',
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

export default Post
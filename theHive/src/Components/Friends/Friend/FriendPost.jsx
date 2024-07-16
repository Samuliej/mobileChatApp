import React, { useState, useRef, useContext } from 'react'
import { View, Text, StyleSheet, Image, Animated, TextInput } from 'react-native'
import { UserContext } from '../../../Context/UserContext.js'
import { Ionicons } from '@expo/vector-icons'
import CustomButton from '../../SignIn/CustomButton.jsx'

/**
 * FriendPost is a React component that displays a single post in a social media style application.
 * It allows users to like and comment on the post.
 *
 * Props:
 * - post: Object. The initial post data.
 * - likePost: Function. A function to handle liking a post.
 * - commentPost: Function. A function to handle commenting on a post.
 *
 * State:
 * - commentsOpen: Boolean. Determines whether the comments section is open.
 * - commentText: String. The text of the new comment being written.
 * - post: Object. The current state of the post, including any new comments or likes.
 * - justLiked: Boolean. Indicates whether the current user has just liked the post.
 *
 * Context:
 * - UserContext: Provides information about the current user.
 *
 * The component displays the post's image (if available), text content, and actions for liking and commenting.
 * It also shows the number of likes and comments the post has received.
 * Users can submit new comments through a TextInput field.
 *
 * The like button uses an Animated component to provide feedback when a user likes a post.
 *
 * Returns:
 * - A View component containing the post's content, actions for liking and commenting, and the comments section (if open).
 *
 * Note:
 * - The component uses the useContext hook to access the current user's information from UserContext.
 * - The useState hook is used to manage the component's state.
 * - The useRef hook is used to manage the like button's animation.
 */
const FriendPost = ({ post: initialPost, likePost, commentPost }) => {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [post, setPost] = useState(initialPost)
  const [justLiked, setJustLiked] = useState(false)
  const { user } = useContext(UserContext)
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
import React, { useContext, useEffect, useState } from 'react'
import { TextInput, ScrollView, View, Text, StyleSheet, Pressable, ActivityIndicator, Image, Button } from 'react-native'
import { UserContext } from '../../Context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import usePosts from '../../hooks/usePosts'
import usePost from '../../hooks/usePost'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon
import defaultProfilePicture from '../../../assets/soldier.png'

const Post = ({ post: initialPost, onLike, commentPost, user }) => {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [post, setPost] = useState(initialPost)

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


  console.log(post)

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
          <Ionicons name="thumbs-up-outline" size={24} color="black" onPress={() => onLike(post._id)} />
          <Text>{post.likes}</Text>
        </View>
        <View style={styles.commentContainer}>
          <Ionicons name="chatbubble-outline" size={24} color="black" onPress={() => setCommentsOpen(!commentsOpen)} />
        </View>
      </View>
      {commentsOpen && (
        <View style={styles.commentsSection}>
          {post.comments.map((comment) => (
            console.log(comment),
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


const FeedScreen = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const { loading, posts, error, refreshPosts } = usePosts(user._id)
  const { likePost, commentPost } = usePost()

  // refresh posts when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('refreshing posts')
      refreshPosts()
    })

    return unsubscribe
  }, [navigation])

  const handleLike = async (postId) => {
    await likePost(postId)
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Fetching posts...</Text>
      </View>
    )
  }

  // Add error banner
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {posts.map(post => (
          <Post key={post._id} post={post} onLike={handleLike} commentPost={commentPost} user={user}/>
        ))}
      </ScrollView>
      <Pressable
        style={styles.fab}
        onPress={() => {
          navigation.navigate('NewPost')
        }}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="newspaper-outline" size={30} color="white" />
          <Ionicons name="add" size={24} color="white" style={styles.plusIcon} />
        </View>
      </Pressable>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: '100%',
    padding: 10,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 35,
    elevation: 8
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    position: 'absolute',
    left: 20,
    top: 20
  },
  postContainer: {
    width: '95%',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
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
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default FeedScreen
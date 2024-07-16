import { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { useRoute } from '@react-navigation/native'
import useFriendsPosts from '../../../hooks/useFriendsPosts'
import useGetUserById from '../../../hooks/useGetUserById'
import FriendPost from './FriendPost.jsx'
import usePost from '../../../hooks/usePost.js'
const defaultProfilePicture = require('../../../../assets/soldier.png')
import theme from '../../../theme.js'


/**
 * Friend is a React component that displays the profile and posts of a friend in a social media style application.
 * It uses navigation to dynamically set the title to the friend's username once loaded.
 *
 * Props:
 * - navigation: Object. The navigation object provided by React Navigation for navigating between screens.
 *
 * State:
 * - currentView: String. Controls which view to display ('info' or 'posts').
 *
 * Hooks:
 * - useRoute: To access the route parameters.
 * - useState: To manage the currentView state.
 * - useEffect: To set the navigation title based on the loaded user's username.
 * - useFriendsPosts: Custom hook to fetch the friend's posts.
 * - useGetUserById: Custom hook to fetch the friend's user information.
 * - usePost: Custom hook to provide functions for liking and commenting on posts.
 *
 * The component displays a loading indicator while the friend's information or posts are being fetched.
 * Once the data is loaded, it shows the friend's profile picture, username, and additional user information.
 * It also provides buttons to toggle between viewing the user's information and their posts.
 *
 * The posts view displays a list of FriendPost components, each representing a single post.
 *
 * Returns:
 * - A ScrollView containing the friend's profile information and posts, or a loading indicator if the data is still being fetched.
 *
 * Note:
 * - The component uses several custom hooks for data fetching and actions (likePost, commentPost).
 * - It dynamically sets the navigation title to the friend's username once it is loaded.
 */
const Friend = ({ navigation }) => {
  const route = useRoute()
  const { friendId } = route.params
  const { loading, friendPosts } = useFriendsPosts(friendId)
  const { loading: loadingFriend, user } = useGetUserById(friendId)
  const { likePost, commentPost } = usePost()
  const [currentView, setCurrentView] = useState('info')

  useEffect(() => {
    if (user && user.username) {
      navigation.setOptions({ title: user.username })
    }
  }, [user, navigation])

  if (loading || loadingFriend) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.imageContainer}>
            <Image source={user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture} style={styles.image} />
          </View>
        </View>
        <View>
          <Text style={styles.title}>{user.username}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <Pressable
              onPress={() => setCurrentView('info')}
              style={{
                backgroundColor: currentView === 'info' ? '#4CAF50' : '#f8f9fa',
                ...styles.buttonStyle
              }}
            >
              <Text style={{ color: currentView === 'info' ? '#ffffff' : '#000000' }}>User Info</Text>
            </Pressable>
            <Pressable
              onPress={() => setCurrentView('posts')}
              style={{
                backgroundColor: currentView === 'posts' ? '#4CAF50' : '#f8f9fa',
                ...styles.buttonStyle
              }}
            >
              <Text style={{ color: currentView === 'posts' ? '#ffffff' : '#000000' }}>Posts</Text>
            </Pressable>
          </View>
          {(currentView === 'info') &&(
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
          {(currentView === 'posts') && friendPosts.map(post =>
            <FriendPost key={post._id} post={post} likePost={likePost} commentPost={commentPost} />
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 1,
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
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    ...theme.shadow
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Friend
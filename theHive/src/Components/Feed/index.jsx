import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native'
import { UserContext } from '../../Context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import usePosts from '../../hooks/usePosts'
import usePost from '../../hooks/usePost'
import Post from './Post/index'

/**
 * FeedScreen is a React component for displaying a feed of posts in a social media app.
 * It allows users to view posts, refresh the feed, and navigate to the screen for creating a new post.
 *
 * Props:
 * - navigation: Object. The navigation prop passed from React Navigation, used for navigating between screens.
 *
 * State:
 * - refreshing: Boolean. Indicates whether the feed is being refreshed.
 *
 * Context:
 * - UserContext: Provides access to the current user's information.
 *
 * Hooks:
 * - useContext: To access the current user's information from UserContext.
 * - useState: To manage the 'refreshing' state.
 * - useEffect: To perform side effects, including adding an event listener for screen focus and refreshing posts.
 * - useCallback: To memoize the onRefresh callback function.
 * - usePosts: Custom hook to fetch posts and manage loading state and post data.
 * - usePost: Custom hook to perform actions like liking and commenting on posts.
 *
 * Returns:
 * - A view component that displays a loading indicator while posts are being fetched,
 *   or a scrollable list of posts once the data is loaded. It also includes a floating action button
 *   to navigate to the screen for creating a new post.
 */
const FeedScreen = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const { loading, posts, refreshPosts } = usePosts(user._id)
  const { likePost, commentPost } = usePost()

  const [refreshing, setRefreshing] = useState(false)

  // For refreshing when scrolling up
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    refreshPosts().then(() => setRefreshing(false))
  }, [])

  // refresh posts when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('refreshing posts')
      refreshPosts()
    })

    return unsubscribe
  }, [navigation])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Fetching posts...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.scrollViewContentContainer}>
          {posts.map(post => (
            <Post key={post._id} post={post} likePost={likePost} commentPost={commentPost} user={user} navigation={navigation}/>
          ))}
        </View>
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

// Styles

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
  scrollViewContentContainer: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#4CAF50',
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
})

export default FeedScreen
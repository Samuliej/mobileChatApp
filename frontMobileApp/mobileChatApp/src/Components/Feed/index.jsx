import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, Pressable, ActivityIndicator, RefreshControl } from 'react-native'
import { UserContext } from '../../Context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import usePosts from '../../hooks/usePosts'
import usePost from '../../hooks/usePost'
import Post from './Post/index'

/*

  Main screen for the feed component that is navigated through the
  tab navigation. Displays all the posts that the user's friends have posted.

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
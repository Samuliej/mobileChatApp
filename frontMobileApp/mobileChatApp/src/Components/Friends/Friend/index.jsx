import React from 'react'
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useRoute } from '@react-navigation/native'
import useFriendsPosts from '../../../hooks/useFriendsPosts'
import useGetUserById from '../../../hooks/useGetUserById'
import FriendPost from './FriendPost.jsx'
import usePost from '../../../hooks/usePost.js'
const defaultProfilePicture = require('../../../../assets/soldier.png')

const DisplayUser = ({ friendId }) => {
  const { loading, user } = useGetUserById(friendId)

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    user && (
      <View style={styles.userContainer}>
        <Text style={styles.usernameHeader}>{user.username}</Text>
        <View style={styles.profileAndInfo}>
          <View style={styles.imageContainer}>
            <Image source={user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture} style={styles.profileImage} />
          </View>
          <View style={styles.userInfo}>
            <Text>Name: {user.name}</Text>
            <Text>City: {user.city ? user.city : 'City not provided'}</Text>
            <Text>Phone: {user.phone ? user.phone : 'Phone not provided'}</Text>
          </View>
        </View>
      </View>
    )
  )
}

const Friend = () => {
  const route = useRoute()
  const { friendId } = route.params
  const { loading, friendPosts } = useFriendsPosts(friendId)
  const { likePost, commentPost } = usePost()

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DisplayUser friendId={friendId} />
      {friendPosts.length > 0 && (
        <View style={styles.postsHeaderContainer}>
          <Text style={styles.postsHeaderText}>Posts</Text>
          <ScrollView style={styles.postsContainer}>
            {friendPosts.map((post) => (
              <FriendPost key={post._id} post={post} likePost={likePost} commentPost={commentPost} />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  userContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    paddingBottom: 20,
    borderRadius: 7
  },
  profileAndInfo: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 10,
    marginLeft: 10
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    justifyContent: 'center',
  },
  postsContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexGrow: 1,
    width: '100%',
  },
  usernameHeader: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  postsHeaderContainer: {
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    borderRadius: 7,
    marginTop: 10,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postsHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Friend
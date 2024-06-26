import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { UserContext } from '../../Context/UserContext.js'
import api from '../../api.js'
import { useNavigation } from '@react-navigation/native'
import { SocketContext } from '../../Context/SocketContext.js'
const emptyIcon = require('../../../assets/fist-bump.png')
import FriendItem from './FriendItem.jsx'

/*

  Component for displaying all the friends of the user.
  The component is updated in real-time with socket.io
  You can navigate to a single friend's info and posts displaying component from here also.

*/

const Friends = () => {
  const { user } = useContext(UserContext)
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()
  const socket = useContext(SocketContext)

  // Fetch friends in a useEffect
  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        const fetchedFriends = await Promise.all(user.friends.map(async (friendId) => {
          const response = await api.get(`/api/users/id/${friendId}`)
          const friendUser = await response.data
          return friendUser
        }))

        setFriends(fetchedFriends)
      }
      setLoading(false)
    }

    fetchFriends()

    // Listen for the 'friendRequestAccepted' event
    socket.on('friendRequestAccepted', async (friendship) => {
      // Check if the current user is involved in the friendship
      if (friendship.user1._id === user._id || friendship.user2._id === user._id) {
        // Get the new friend's user object
        const newFriendId = friendship.user1._id === user._id ? friendship.user2._id : friendship.user1._id
        const response = await api.get(`/api/users/id/${newFriendId}`)
        const newFriend = await response.data

        // Update the friends state to include the new friend
        setFriends(prevFriends => [...prevFriends, newFriend])
      }
    })

    return () => {
      socket.off('friendRequestAccepted')
    }

  }, [user ? user.friends : null, socket])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {friends.length === 0 && (
        <View style={styles.emptyContainer}>
          <Image source={emptyIcon} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>
            {"Looks like you don't have any friends yet, no worries, you can navigate to search for a user page and start making connections!"}
          </Text>
          <Pressable style={styles.goButton} onPress={() => navigation.navigate('Search for a User')}>
            <Text style={styles.buttonText}>Go!</Text>
          </Pressable>
        </View>
      )}
      {friends.length > 0 && (
        <ScrollView>
          {friends.map(friend => (
            <FriendItem key={friend._id} friend={friend} navigation={navigation} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  goButton: {
    marginTop: 20,
    backgroundColor: '#6495ED',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Friends
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { UserContext } from '../../Context/UserContext.js'
import api from '../../api.js'
import { useNavigation } from '@react-navigation/native'
const emptyIcon = require('../../../assets/fist-bump.png')
const defaultProfilePicture = require('../../../assets/soldier.png')

const Friends = () => {
  const { user } = useContext(UserContext)
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

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
  }, [user ? user.friends : null])

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
        <>
          {friends.map(friend => (
            <View key={friend._id} style={styles.friendItem}>
              <Image source={friend.profilePicture ? { uri: friend.profilePicture } : defaultProfilePicture} style={styles.profileImage} />
              <Text style={styles.username}>{friend.username}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  )
}

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
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  username: {
    flex: 1,
    fontSize: 18,
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
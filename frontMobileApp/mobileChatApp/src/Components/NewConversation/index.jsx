import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { UserContext } from '../../Context/UserContext.js'
import api from '../../api.js'
import { useNavigation } from '@react-navigation/native'
import CustomButton from '../SignIn/CustomButton.jsx'
import FriendsToChat from './FriendsToChat/index.jsx'
import AsyncStorage from '@react-native-async-storage/async-storage'


/**
 * NewConversation is a React component for initiating new conversations or creating groups with friends.
 * It fetches the user's friends, displays them, and allows the user to start new chats or create a new group.
 *
 * State:
 * - friends: An array of friend objects fetched based on the current user's friend list.
 * - loading: A boolean indicating whether the friend list is still being fetched.
 *
 * Context:
 * - Uses UserContext to access and manipulate the current user's information.
 *
 * Effects:
 * - On component mount, fetches the user's friends from the API and updates the `friends` state.
 *
 * Returns:
 * - An ActivityIndicator if data is still loading.
 * - Once data is loaded, displays options to create a new group and a list of friends to start a conversation with.
 *
 * Navigation:
 * - Uses `useNavigation` hook from `@react-navigation/native` for navigation purposes.
 *
 * Props:
 * - None explicitly defined, but utilizes `user`, `updateUser`, and `navigation` from context and hooks.
 *
 */
const NewConversation = () => {
  const { user, updateUser } = useContext(UserContext)
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const [creatingConvo, setCreatingConvo] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        const token = await AsyncStorage.getItem('userToken')
        const fetchedFriends = await Promise.all(user.friends.map(async (friendId) => {
          const response = await api.get(`/api/users/id/${friendId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const friendUser = await response.data
          return friendUser
        }))

        setFriends(fetchedFriends.sort((a, b) => a.username.localeCompare(b.username)))
      }
      setLoading(false)
    }

    fetchFriends()
  }, [user ? user.friends : null])

  if (loading || creatingConvo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.groupText}>Create a new group</Text>
      <CustomButton title="Create Group" onPress={() => {
        // navigate to Create Group screen
        console.log('Create group')
      }} />

      <Text style={styles.friendsText}>Your Friends</Text>
      <FriendsToChat
        friends={friends}
        user={user}
        updateUser={updateUser}
        navigation={navigation}
        setCreatingConvo={setCreatingConvo}
      />
    </View>
  )
}

//  Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupText: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
    padding: 5
  },
  friendsText: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: 10,
    textAlign: 'center',
    padding: 5
  }
})

export default NewConversation
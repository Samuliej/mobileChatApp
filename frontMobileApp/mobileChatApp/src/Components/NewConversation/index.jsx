import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { UserContext } from '../../Context/UserContext.js'
import api from '../../api.js'
import { useNavigation } from '@react-navigation/native'
import CustomButton from '../SignIn/CustomButton.jsx'
import FriendsToChat from './FriendsToChat/index.jsx'


/*

  Component for displaying a list of friends of the users who you can start a conversation with.

*/

// TODO: group

// Component for rendering the friends and the logic of starting a new conversation
const NewConversation = () => {
  const { user, updateUser } = useContext(UserContext)
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

        setFriends(fetchedFriends.sort((a, b) => a.username.localeCompare(b.username)))
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
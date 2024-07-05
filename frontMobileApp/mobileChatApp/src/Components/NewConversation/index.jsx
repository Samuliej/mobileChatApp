import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { UserContext } from '../../Context/UserContext.js'
import api from '../../api.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import CustomButton from '../SignIn/CustomButton.jsx'
const defaultProfilePicture = require('../../../assets/soldier.png')

/*

  Component for displaying a list of friends of the users who you can start a conversation with.

*/

// TODO: group

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
      <Text style={{ fontSize: 20, marginBottom: 5, textAlign: 'center', padding: 5 }}>Create a new group</Text>
      <CustomButton title="Create Group" onPress={() => {
        // navigate to Create Group screen
        console.log('Create group')
      }} />

      <Text style={{ fontSize: 20, marginBottom: 5, marginTop: 10, textAlign: 'center', padding: 5 }}>Your Friends</Text>
      <ScrollView>
        {/* Exclude the friends with whom there is already a started conversation */}
        {friends.filter(friend => !user.conversations.map(convo => convo._id).some(conversationId => friend.conversations.includes(conversationId))).map(friend => (
          <View key={friend._id} style={styles.friendItem}>
            <Image source={friend.profilePicture ? { uri: friend.profilePicture } : defaultProfilePicture} style={styles.profileImage} />
            <Text style={styles.username}>{friend.username}</Text>
            <CustomButton title="Chat" onPress={async () => {
              // start a new conversation with this friend
              const userToken = await AsyncStorage.getItem('userToken')
              const response = await api.post('/api/startConversation', { username: friend.username }, {
                headers: {
                  Authorization: `Bearer ${userToken}`
                }
              })
              const conversation = response.data.conversation
              console.log('created conversation', conversation)
              updateUser(userToken)
              // navigate to Chat screen with this conversation
              navigation.navigate('Chat', { conversationId: conversation._id, friend: friend })
            }} />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

//  Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    flex: 1,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default NewConversation
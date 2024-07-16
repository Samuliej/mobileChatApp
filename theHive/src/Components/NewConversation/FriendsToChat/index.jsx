import { ScrollView, View, Image, Text, StyleSheet } from 'react-native'
import CustomButton from '../../SignIn/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
const defaultProfilePicture = require('../../../../assets/soldier.png')
import api from '../../../api.js'

/**
 * FriendsToChat is a React component that renders a list of friends that the user can start a chat with.
 * It filters out friends with whom the user already has a started conversation.
 *
 * Props:
 * - friends: Array of friend objects to display.
 * - user: The current user object, including their conversations.
 * - updateUser: Function to update the user data.
 * - navigation: Navigation prop passed from the parent component for navigating to different screens.
 *
 * Behavior:
 * - Displays a list of friends, excluding those with whom the user already has a conversation.
 * - Each friend item shows the friend's profile picture (or a default picture if none is set), username, and a "Chat" button.
 * - Pressing the "Chat" button initiates a new conversation with the selected friend by calling an API endpoint and then navigates to the Chat screen with the new conversation.
 *
 * API Calls:
 * - Uses AsyncStorage to retrieve the user's token.
 * - Calls the '/api/startConversation' endpoint to start a new conversation with a friend.
 *
 * Navigation:
 * - Navigates to the 'Chat' screen with the newly created conversation ID and friend's details.
 *
 */
const FriendsToChat = ({friends, user, updateUser, navigation, setCreatingConvo}) => {
  return (
    <ScrollView>
      {/* Exclude the friends with whom there is already a started conversation */}
      {friends.filter(friend => !user.conversations.map(convo => convo._id).some(conversationId => friend.conversations.includes(conversationId))).map(friend => (
        <View key={friend._id} style={styles.friendItem}>
          <Image source={friend.profilePicture ? { uri: friend.profilePicture } : defaultProfilePicture} style={styles.profileImage} />
          <Text style={styles.username}>{friend.username}</Text>
          <CustomButton title="Chat" onPress={async () => {
            // start a new conversation with this friend
            setCreatingConvo(true)
            const userToken = await AsyncStorage.getItem('userToken')
            const response = await api.post('/api/startConversation', { username: friend.username }, {
              headers: {
                Authorization: `Bearer ${userToken}`
              }
            })
            const conversation = response.data.conversation
            updateUser(userToken)
            // navigate to Chat screen with this conversation
            navigation.navigate('Chat', { conversationId: conversation._id, friend: friend })
            setCreatingConvo(false)
          }} />
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
})

export default FriendsToChat
import { ScrollView, View, Image, Text, StyleSheet } from 'react-native'
import CustomButton from '../../SignIn/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
const defaultProfilePicture = require('../../../../assets/soldier.png')
import api from '../../../api.js'

// Component for rendering all the friends that the user can start a conversation with
const FriendsToChat = ({friends, user, updateUser, navigation}) => {
  return (
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
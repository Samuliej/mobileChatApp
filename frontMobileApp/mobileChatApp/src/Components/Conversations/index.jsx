import React, { useContext } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList, Image, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { UserContext } from '../../Context/UserContext.js'
import useConversations from '../../hooks/useConversations.js'
const defaultProfilePicture = require('../../../assets/soldier.png')

// TODO: Sort the conversations by last message time
// TODO: Smoother transition when navigating to Chat screen

const Conversations = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const { conversations, loading } = useConversations(user)

  if (loading) {
    // Display a loading screen when loading
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {conversations.length > 0 && (
        <FlatList
          data={conversations}
          keyExtractor={item => item && item._id ? item._id : ''}
          renderItem={({ item }) => item && (
            <Pressable style={styles.conversationItem} onPress={() => item._id && navigation.navigate('Chat', { conversationId: item._id })}>
              <Image source={item.friend && item.friend.profilePicture ? { uri: item.friend.profilePicture } : defaultProfilePicture} style={styles.profilePicture} />
              <Text style={styles.conversationText}>{item.friend && item.friend.username}</Text>
            </Pressable>
          )}
        />
      )}
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('New conversation')}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="chatbubbles-outline" size={30} color="white" />
          <Ionicons name="add" size={24} color="white" style={styles.plusIcon} />
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
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
    top: 15
  },
  conversationItem: {
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
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  conversationText: {
    flex: 1,
    fontSize: 18,
  },
})

export default Conversations
import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList, Image, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { UserContext } from '../../Context/UserContext.js'
import useConversations from '../../hooks/useConversations.js'
import { truncate } from '../../utils/utils.js'
import useDeleteConversation from '../../hooks/useDeleteConversation.js'
const defaultProfilePicture = require('../../../assets/soldier.png')

// TODO: Implement notifications for new messages on the convo list

/*

  Conversations component. This app displays the ongoing conversations between the current user and
  his friends. The single conversation component shows the profile picture and the name of the friend,
  and also it displays the last message in the conversation.

*/

const Conversations = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const { conversations, loading } = useConversations(user)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [deleteConversation, isLoading] = useDeleteConversation()
  const [sortedConversations, setSortedConversations] = useState([])

  if (loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  // Function to handle long press on a conversation item
  const handleLongPress = (conversation) => {
    console.log('long pressed')
    setSelectedConversation(conversation)
  }

  // Function to handle conversation removal
  const handleRemoveConversation = async () => {
    console.log('removing conversation')
    await deleteConversation(selectedConversation._id)
    setSelectedConversation(null)
  }

  const handleCancelRemoveConversation = () => {
    setSelectedConversation(null)
  }

  // Sort conversations when the conversations change
  useEffect(() => {
    const sorted = conversations
      .filter(conversation => conversation !== undefined)
      .sort((a, b) => {
        if (!a.timestamp || !b.timestamp) {
          return 0
        }
        return new Date(b.timestamp) - new Date(a.timestamp)
      })

    setSortedConversations(sorted)
  }, [conversations])


  return (
    <View style={styles.container}>
      {selectedConversation && (
        <View style={styles.redBar}>
          <Text style={styles.redBarText}>Remove conversation with {selectedConversation.friend.name}?</Text>
          <Pressable onPress={handleRemoveConversation}>
            <Text style={[styles.redBarText, { borderWidth: 1, borderColor: '#000', borderRadius: 5, padding: 3 }]}>Remove</Text>
          </Pressable>
          <Pressable onPress={handleCancelRemoveConversation}>
            <Text style={[styles.redBarText, { borderWidth: 1, borderColor: '#000', borderRadius: 5, padding: 3 }]}>Cancel</Text>
          </Pressable>
        </View>
      )}
      {/* Display conversations */}
      {conversations.length > 0 && (
        <FlatList
          data={sortedConversations}
          keyExtractor={item => item && item._id ? item._id : ''}
          renderItem={({ item }) => item && (
            <Pressable
              style={styles.conversationItem}
              onPress={() => {
                if (selectedConversation) {
                  setSelectedConversation(null)
                } else if (item._id) {
                  navigation.navigate('Chat', { conversationId: item._id })
                }
              }}
              onLongPress={() => handleLongPress(item)}
            >
              <Image source={item.friend && item.friend.profilePicture ? { uri: item.friend.profilePicture } : defaultProfilePicture} style={styles.profilePicture} />
              <View style={styles.textContainer}>
                <Text style={styles.conversationText}>{item.friend && item.friend.username}</Text>
                {item.lastMessage && <Text style={styles.latestMessage}>{truncate(item.lastMessage.content, 25)}</Text>}
              </View>
            </Pressable>
          )}
        />
      )}
      {/* Icon for entering the view to start new conversations */}
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

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  redBar: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  redBarText: {
    color: '#fff',
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
    marginBottom: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Conversations
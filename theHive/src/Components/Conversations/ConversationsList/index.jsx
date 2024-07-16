import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native'
import { truncate, formatTimestamp } from '../../../utils/utils'
const defaultProfilePicture = require('../../../../assets/soldier.png')

/**
 * ConversationsList is a React component that renders a list of conversation items for a messaging application.
 * It supports pull-to-refresh to update the conversations list and navigation to individual chat screens.
 *
 * Props:
 * - sortedConversations: Array. An array of conversation objects to be displayed.
 * - selectedConversation: Object. The currently selected conversation, if any.
 * - setSelectedConversation: Function. A function to update the state of the selected conversation.
 * - navigation: Object. The navigation object provided by React Navigation to navigate between screens.
 * - handleLongPress: Function. A function to handle long press actions on a conversation item.
 * - fetchAndUpdate: Function. A function to fetch and update the list of conversations.
 *
 * State:
 * - refreshing: boolean. A state to indicate whether the list is being refreshed.
 *
 * The component:
 * - Displays an activity indicator and a fetching message when the list is being refreshed.
 * - Renders a FlatList of conversation items. Each item includes the friend's profile picture, username, the last message, and a timestamp.
 * - Implements pull-to-refresh functionality using the RefreshControl component.
 * - Navigates to the chat screen with the selected conversation when a conversation item is pressed.
 * - Calls the handleLongPress function when a conversation item is long-pressed.
 *
 * Returns:
 * - A View component containing either a loading indicator or a FlatList of conversation items.
 */
const ConversationsList = ({
  sortedConversations, selectedConversation, setSelectedConversation, navigation, handleLongPress, fetchAndUpdate
}) => {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchAndUpdate()
    setRefreshing(false)
  }


  return (
    <View style={styles.container}>
      {refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Fetching conversations...</Text>
        </View>
      ):
        <FlatList
          data={sortedConversations}
          keyExtractor={item => item && item._id ? item._id : ''}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
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
              <View style={styles.containerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.conversationText}>{item.friend && item.friend.username}</Text>
                  {item.lastMessage && <Text style={styles.latestMessage}>{truncate(item.lastMessage.content, 25)}</Text>}
                </View>
                <Text style={styles.timestamp}>{item.lastMessage && formatTimestamp(item.lastMessage.timestamp)}</Text>
              </View>
            </Pressable>
          )}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
    marginHorizontal: 10,
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
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationText: {
    flex: 1,
    fontSize: 18,
  },
  timestamp: {
    fontSize: 11,
    flexShrink: 1,
    marginRight: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ConversationsList
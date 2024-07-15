import { useState } from 'react'
import { View, Text, StyleSheet, Pressable, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native'
import { truncate, formatTimestamp } from '../../../utils/utils'
const defaultProfilePicture = require('../../../../assets/soldier.png')

// Component for rendering the Conversation list
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
    fontSize: 12,
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
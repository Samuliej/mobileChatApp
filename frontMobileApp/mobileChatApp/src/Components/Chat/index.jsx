import React, { useContext, useRef, useState } from 'react'
import {
  View, Text,
  Pressable, StyleSheet, FlatList,
  Image, ImageBackground, StatusBar,
  ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../../Context/UserContext.js'
import useChat from '../../hooks/useChat.js'
import uuid from 'react-native-uuid'
import MessageInput from './MessageInput/index.jsx'
import MessageItem from './MessageItem/index.jsx'
const defaultProfilePicture = require('../../../assets/soldier.png')
const defaultBackgroundPicture = require('../../../assets/rm222-mind-14.jpg')

/*

Module for the Chat functionality in the app

1. CustomNavBar: This component displays a navigation bar at the top of the chat screen.
   It includes a back button and displays the friend's profile picture and username.
2. MessageItem: This component is responsible for rendering individual messages in the chat.
   It formats the timestamp of the message and determines whether the message was sent by the current user or a friend.
3. Chat: This is the main component of the module. It uses the UserContext to access the current user's data and the useChat
   hook to manage the chat state. It renders the CustomNavBar and a FlatList of MessageItem components.
   It also includes a TextInput for sending new messages and a send button.

*/


const CustomNavBar = ({ navigation, friend }) => {
  const handleBackButton = () => {
    navigation.goBack()
  }


  return (
    <View style={styles.navBar}>
      <Pressable onPress={handleBackButton} style={styles.backButton}>
        <Text style={{ fontSize: 30 }}>←</Text>
      </Pressable>
      <Image source={friend && friend.profilePicture ? { uri: friend.profilePicture } : defaultProfilePicture} style={styles.profilePicture} />
      <Text style={{ fontSize: 20 }}>{friend ? friend.username : 'New Conversation'}</Text>
    </View>
  )
}

const Chat = ({ route }) => {
  const { user } = useContext(UserContext)
  const navigation = useNavigation()
  const { conversationId, friend: initialFriend } = route.params
  const flatListRef = useRef(null)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const { messagesData, isLoading, hasNextPage, fetchNextPage, newMessage, setNewMessage, sendMessage, friend } = useChat(user, conversationId, initialFriend)

  const handleEndReached = async () => {
    if (hasNextPage && !isFetchingMore) {
      setIsFetchingMore(true)
      await fetchNextPage()
      setIsFetchingMore(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <ImageBackground source={defaultBackgroundPicture} style={styles.container}>
      <CustomNavBar navigation={navigation} friend={friend}/>
      <View style={styles.content}>
        <View style={styles.header}>
          {isFetchingMore && hasNextPage && <ActivityIndicator size="small" color="#0000ff" />}
        </View>
        <FlatList
          inverted
          ref={flatListRef}
          data={messagesData.pages.flatMap(page => {
            return page.conversation.messages
          })}
          keyExtractor={item => item && item._id ? item._id : uuid.v4()}
          renderItem={({ item }) => <MessageItem item={item} user={user} />}
          onEndReached={handleEndReached}
          onEndReachedTreshold={0.5}
        />
        <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} />
      </View>
    </ImageBackground>

  )
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(248, 246, 240, 0.6)',
    padding: 10,
    marginTop: StatusBar.currentHeight,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default Chat
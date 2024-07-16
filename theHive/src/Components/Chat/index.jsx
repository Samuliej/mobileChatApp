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


/**
 * CustomNavBar is a React component that renders a custom navigation bar for a chat screen.
 * It displays a back button, the friend's profile picture, and the friend's username or "New Conversation" if no friend is selected.
 *
 * Props:
 * - navigation: Object. The navigation object provided by the navigation library (e.g., React Navigation) to navigate between screens.
 * - friend: Object. The friend's information including `profilePicture` and `username`. If not provided, defaults to a new conversation setup.
 *
 * The component includes:
 * - A back button that, when pressed, calls the `navigation.goBack` method to return to the previous screen.
 * - An image component that displays the friend's profile picture if available, or a default profile picture otherwise.
 * - A text component that displays the friend's username or "New Conversation" if the `friend` prop is not provided.
 *
 * Returns:
 * - A View component containing the custom navigation bar with back button, profile picture, and username or default text.
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


/**
 * Chat is a React component that renders a chat interface for a specific conversation.
 * It displays messages from the conversation, allows the user to send new messages, and fetches more messages when the end of the list is reached.
 *
 * Props:
 * - route: Object. Contains parameters passed to this component, including `conversationId` and `initialFriend`.
 *
 * State and Context:
 * - user: Object. The current user's information obtained from UserContext.
 * - isFetchingMore: boolean. Indicates whether the component is currently fetching more messages.
 *
 * Hooks:
 * - useContext(UserContext) to access the current user's information.
 * - useNavigation() to navigate between screens.
 * - useRef(null) to reference the FlatList component.
 * - useState(false) to manage the fetching state.
 * - useChat custom hook to manage chat data and actions, including loading messages, sending messages, and fetching more messages.
 *
 * The component:
 * - Displays a loading indicator if messages are being loaded.
 * - Uses an ImageBackground for styling.
 * - Includes a custom navigation bar with a back button and the friend's profile picture.
 * - Renders a list of messages using FlatList, which is inverted to start from the bottom.
 * - Automatically fetches more messages when the end of the list is reached, if there are more messages to load.
 * - Provides an input field for sending new messages.
 *
 * Returns:
 * - A loading view if messages are still loading.
 * - The chat interface, including the navigation bar, messages list, and message input field, once messages have loaded.
 */
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
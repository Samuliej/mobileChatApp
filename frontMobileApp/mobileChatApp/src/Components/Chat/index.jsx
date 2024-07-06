import React, { useContext, useRef, useState, useEffect } from 'react'
import {
  View, Text, TextInput,
  Pressable, StyleSheet, FlatList,
  Image, ImageBackground, StatusBar,
  ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../../Context/UserContext.js'
import Icon from 'react-native-vector-icons/Ionicons'
import useChat from '../../hooks/useChat.js'
import uuid from 'react-native-uuid'
import theme from '../../theme.js'
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

const MessageItem = ({ item, user }) => {
  if (!item) {
    return null
  }
  if (!item._id) {
    // Item doesn't have an ID, generate a temporary one
    item._id = Math.random().toString(36).substr(2, 9)
  }

  const date = new Date(item.timestamp)
  const formattedDate = date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Variable for figuring out whether the message is sent by the current user
  const isMyMessage = user && item.sender === user._id

  return (
    <View style={isMyMessage ? styles.myMessageContainer : styles.messageContainer}>
      <View key={item._id} style={[styles.messageItem, isMyMessage ? styles.myMessage : styles.friendMessage]}>
        <Text>{item.content}</Text>
        <Text style={styles.timestamp}>{formattedDate} {item.status}</Text>
        {/* Position the tail using absolute positioning */}
        <View style={isMyMessage ? styles.myMessageTail : styles.friendMessageTail}></View>
      </View>
    </View>
  )
}



const Chat = ({ route }) => {
  const { user } = useContext(UserContext)
  const navigation = useNavigation()
  const { conversationId, friend: initialFriend } = route.params
  const flatListRef = useRef(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const {
    friend, conversation, newMessage,
    setNewMessage, inputHeight, setInputHeight,
    loading, sendMessage, loadMoreMessages
  } = useChat(user, conversationId, initialFriend)

  const handleLoadMoreMessages = () => {
    if (loading || isAtBottom || isLoadingMore) return
    setIsLoadingMore(true)
    setTimeout(() => {
      loadMoreMessages()
      setIsLoadingMore(false)
    }, 300)
  }

  if (loading) {
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
        </View>
        {conversation && <FlatList
          ref={flatListRef}
          key={conversationId}
          data={conversation.messages}
          keyExtractor={item => item && item._id ? item._id : uuid.v4()}
          renderItem={({ item }) => <MessageItem item={item} user={user} />}
          onScroll={({ nativeEvent }) => {
            const isCloseToBottom = nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 50
            setIsAtBottom(isCloseToBottom)
            if (nativeEvent.contentOffset.y < 20) {
              handleLoadMoreMessages()
            }
          }}
          onContentSizeChange={() => {
            if (isAtBottom) flatListRef.current.scrollToEnd({ animated: false })
          }}
        />}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { height: Math.max(35, inputHeight) }]}
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
            placeholder="Type a message..."
            multiline
            onContentSizeChange={(event) => {
              setInputHeight(event.nativeEvent.contentSize.height)
            }}
          />
          <Pressable style={styles.sendButton} onPress={() => {
            if (newMessage.length !== 0) sendMessage()
          }}>
            <Icon name="send" size={24} color="white" />
          </Pressable>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageItem: {
    flexDirection: 'column',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  friendMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
    color: 'white',
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F8F6F0',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: theme.platformStyle.color,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  messageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 10
  },
  myMessageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 10,
    padding: 10,
  },
  friendMessageTail: {
    position: 'absolute',
    bottom: 0, // Adjust as necessary
    left: -10, // Adjust to position the tail correctly
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#eee',
  },
  myMessageTail: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#0084ff',
  },
  timestamp: {
    marginTop: 2,
    fontSize: 8,
    color: 'black',
    alignSelf: 'flex-end',
  },
})

export default Chat
import React, { useContext, useRef } from 'react'
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
const defaultProfilePicture = require('../../../assets/soldier.png')
const defaultBackgroundPicture = require('../../../assets/rm222-mind-14.jpg')


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

  console.log('fdasfdsfasdfdsfdsafdsafsafdsffdasdsaf',item)
  const isMyMessage = user && item.sender === user._id

  return (
    <View style={isMyMessage ? styles.myMessageContainer : styles.messageContainer}>
      <View key={item._id} style={[styles.messageItem, user && item.sender === user._id ? styles.myMessage : styles.friendMessage]}>
        <Text>{item.content}</Text>
      </View>
      <Text style={styles.timestamp}>{formattedDate} {item.status}</Text>
    </View>
  )
}



const Chat = ({ route }) => {
  const { user } = useContext(UserContext)
  const navigation = useNavigation()
  const { conversationId, friend: initialFriend } = route.params
  const flatListRef = useRef(null)
  const {
    friend, conversation, newMessage,
    setNewMessage, inputHeight, setInputHeight,
    loading, sendMessage
  } = useChat(user, conversationId, initialFriend)


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
          /*
          onScroll={({nativeEvent}) => {
            if (nativeEvent.contentOffset.y === 0) {
              // User has scrolled to the top, load more messages
              console.log('load more messages')

            }
          }}
          */
          // Scroll down when opening an conversation
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: false })}
          renderItem={({ item }) => <MessageItem item={item} user={user} />}
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
          <Pressable style={styles.sendButton} onPress={sendMessage}>
            <Icon name="send" size={24} color="lightgreen" />
          </Pressable>
        </View>
      </View>
    </ImageBackground>

  )
}

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
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
    color: 'white',
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
    backgroundColor: '#F8F6F0'
  },
  sendButton: {
    marginLeft: 10,
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
  timestamp: {
    fontSize: 10,
    color: 'gray',
  },
  messageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  myMessageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
})

export default Chat
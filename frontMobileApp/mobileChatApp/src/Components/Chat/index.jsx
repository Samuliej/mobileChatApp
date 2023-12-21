import React, { useEffect, useState, useContext } from 'react'
import {
  View, Text, TextInput,
  Pressable, StyleSheet, FlatList,
  Image, ImageBackground, StatusBar
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../../Context/UserContext.js'
import api from '../../api.js'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
const defaultProfilePicture = require('../../../assets/soldier.png')
const defaultBackgroundPicture = require('../../../assets/rm222-mind-14.jpg')

// TODO: Smoother transition when navigating to Chat screen
// Implement a loading screen, maybe need custom hooks

const CustomNavBar = ({ navigation, friend }) => {
  return (
    <View style={styles.navBar}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
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
  // When the Chat is created
  const { conversationId, friend: initialFriend } = route.params
  // When re-entering Chat
  const [friend, setFriend] = useState(initialFriend)
  const [conversation, setConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(0)

  useEffect(() => {
    const fetchConversation = async () => {
      const response = await api.get(`/api/conversations/${conversationId}`)
      const fetchedConversation = await response.data

      // Check that user is not null before trying to access its properties
      if (user) {
        // Find the friend in the participants list
        const friend = fetchedConversation.participants.find(participant => participant._id !== user._id)

        setFriend(friend)
      }
      setConversation(fetchedConversation)
    }

    fetchConversation()
  }, [conversationId, user])

  return (
    <ImageBackground source={defaultBackgroundPicture} style={styles.container}>
      <CustomNavBar navigation={navigation} friend={friend} />
      <View style={styles.content}>
        <View style={styles.header}>
        </View>
        {conversation && <FlatList
          key={conversationId}
          data={conversation.messages}
          keyExtractor={item => item ? item._id : ''}
          renderItem={({ item }) => {
            if (item.sender) {
              const date = new Date(item.timestamp)
              const formattedDate = date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })
              return (
                <View style={user && item.sender._id === user._id ? styles.myMessageContainer : styles.messageContainer}>
                  <View key={item._id} style={[styles.messageItem, user && item.sender._id === user._id ? styles.myMessage : styles.friendMessage]}>
                    <Text>{item.content}</Text>
                  </View>
                  <Text style={styles.timestamp}>{formattedDate}</Text>
                </View>
              )
            } else {
              // Handle the case where item.sender is null
              return null
            }
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
          <Pressable style={styles.sendButton} onPress={async () => {
            // send the new message
            const userToken = await AsyncStorage.getItem('userToken')
            const response = await api.post('/api/sendMessage', { content: newMessage, conversationId }, {
              headers: {
                Authorization: `Bearer ${userToken}`
              }
            })

            // fetch the conversation again to get the latest messages
            const conversationResponse = await api.get(`/api/conversations/${conversationId}`)
            const updatedConversation = await conversationResponse.data

            // update the conversation state
            setConversation(updatedConversation)

            setNewMessage('')
          }}>
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
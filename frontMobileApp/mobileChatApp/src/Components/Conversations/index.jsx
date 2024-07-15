import React, { useContext, useState, useEffect } from 'react'
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { UserContext } from '../../Context/UserContext.js'
import useConversations from '../../hooks/useConversations.js'
import useDeleteConversation from '../../hooks/useDeleteConversation.js'
import ErrorBanner from '../Error/index.jsx'
import theme from '../../theme.js'
import ConversationsList from './ConversationsList/index.jsx'
import RemoveConversation from './RemoveConversation/index.jsx'


/*

  Conversations component. This app displays the ongoing conversations between the current user and
  his friends. The single conversation component shows the profile picture and the name of the friend,
  and also it displays the last message in the conversation.

*/


// Main component for rendering the Conversations view and functionality
const Conversations = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const { conversations, loading, setConversations, fetchAndUpdate } = useConversations(user)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [deleteConversation, isLoading] = useDeleteConversation()
  const [sortedConversations, setSortedConversations] = useState([])
  const [error, setError] = useState('')

  // Function to handle long press on a conversation item
  const handleLongPress = (conversation) => {
    setSelectedConversation(conversation)
  }

  // Clear error message
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError('')
      }, 5000)


      return () => clearTimeout(timeout)
    }
  }, [error])

  // Function to handle conversation removal
  const handleRemoveConversation = async () => {
    await deleteConversation(selectedConversation._id)
    setConversations(conversations.filter(c => c._id !== selectedConversation._id))
    setError('Conversation removed succesfully')
    setSelectedConversation(null)
  }

  // User pressed cancel
  const handleCancelRemoveConversation = () => {
    setSelectedConversation(null)
  }

  // Sort conversations when the conversations change
  useEffect(() => {
    const sorted = conversations
      .filter(conversation => conversation !== undefined && conversation.lastMessage && conversation.lastMessage.timestamp)
      .sort((a, b) => {
        return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
      })

    setSortedConversations(sorted)
  }, [conversations])


  return (
    <View style={styles.container}>
      {error && (
        <ErrorBanner error={error} type={'success'} />
      )}
      {(loading || isLoading) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {selectedConversation && (
        <RemoveConversation
          selectedConversation={selectedConversation}
          handleRemoveConversation={handleRemoveConversation}
          handleCancelRemoveConversation={handleCancelRemoveConversation}
        />
      )}
      {/* Display conversations */}
      {conversations.length > 0 && (
        <ConversationsList
          sortedConversations={sortedConversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          navigation={navigation}
          handleLongPress={handleLongPress}
          fetchAndUpdate={fetchAndUpdate}
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
    padding: 5
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
    backgroundColor: theme.platformStyle.color,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Conversations
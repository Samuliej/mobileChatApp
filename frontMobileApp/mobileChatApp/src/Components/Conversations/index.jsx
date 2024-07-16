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


/**
 * Conversations is a React component that manages and displays a list of conversations for a messaging application.
 * It allows users to view, select, and remove conversations. It also provides a button to start new conversations.
 *
 * Props:
 * - navigation: Object. The navigation prop provided by React Navigation, used for navigating between screens.
 *
 * State:
 * - selectedConversation: Object|null. The currently selected conversation for potential removal or null if no conversation is selected.
 * - sortedConversations: Array. A sorted array of conversations based on the last message timestamp.
 * - error: String. A string to hold error messages, which is displayed in an ErrorBanner component if not empty.
 *
 * Hooks:
 * - useContext(UserContext): To access the current user's context.
 * - useState: To manage component states such as selectedConversation, sortedConversations, and error.
 * - useEffect: To perform side effects such as clearing error messages after a timeout and sorting conversations when they change.
 * - useConversations: A custom hook to manage fetching and updating conversations.
 * - useDeleteConversation: A custom hook to handle the deletion of a conversation.
 *
 * Component Features:
 * - Displays an error banner if there is an error message.
 * - Shows a loading indicator when conversations are being fetched or a conversation is being deleted.
 * - Renders a RemoveConversation component if a conversation is selected for removal.
 * - Displays a sorted list of conversations through the ConversationsList component.
 * - Provides a floating action button (FAB) to navigate to a screen for starting new conversations.
 *
 * Handlers:
 * - handleLongPress: Sets the selectedConversation state when a conversation item is long-pressed.
 * - handleRemoveConversation: Asynchronously removes a selected conversation and updates the conversations list.
 * - handleCancelRemoveConversation: Resets the selectedConversation state to null, canceling the remove action.
 *
 * Effects:
 * - Clears the error message after a timeout.
 * - Sorts conversations based on the last message timestamp whenever the conversations list changes.
 */
const Conversations = ({ navigation }) => {
  const { user } = useContext(UserContext)
  const { conversations, loading, setConversations, fetchAndUpdate } = useConversations(user)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const { deleteConversation, isLoading } = useDeleteConversation()
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
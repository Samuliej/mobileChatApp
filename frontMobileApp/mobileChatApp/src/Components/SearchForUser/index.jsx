import React, { useState, useContext, useEffect } from 'react'
import { View, TextInput, Text, FlatList, StyleSheet, Image } from 'react-native'
import { useSearchUser } from '../../hooks/useSearchUser'
import theme from '../../theme.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import defaultProfilePicture from '../../../assets/soldier.png'
import useSendFriendRequest from '../../hooks/useSendFriendRequest'
import { UserContext } from '../../Context/UserContext.js'
import ErrorBanner from '../Error/index.jsx'

/**
 * SearchForUser is a React component that allows users to search for other users by username.
 * It displays search results and enables sending friend requests to these users.
 *
 * State:
 * - searchInput: The current value of the search input field.
 * - page: The current page of search results being displayed.
 * - sentRequests: An array of usernames to whom the current user has already sent friend requests.
 * - notification: A message indicating the success or failure of sending a friend request.
 *
 * Hooks:
 * - useState: Manages state for search input, pagination, sent requests, and notifications.
 * - useContext: Accesses the current user's information from UserContext.
 * - useSearchUser: A custom hook that returns search results based on the search input.
 * - useSendFriendRequest: A custom hook that provides a function to send friend requests.
 * - useEffect: Sets a timeout to clear the notification message after 5 seconds.
 *
 * Functions:
 * - loadMoreResults: Increments the page state to load more search results.
 * - handleSendFriendRequest: Sends a friend request to the selected user and updates the UI accordingly.
 *
 * Behavior:
 * - Displays a notification banner at the top if there is a notification message.
 * - Renders a TextInput for the search input.
 * - Displays a FlatList of search results, each with a profile picture, username, and a button to send a friend request.
 * - The friend request button's appearance and functionality change based on the current user's relationship with the listed user.
 */
const SearchForUser = () => {
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const { searchResults } = useSearchUser(searchInput)
  const [sentRequests, setSentRequests] = useState([])
  let userId = null
  const { user } = useContext(UserContext)
  const { sendFriendRequest } = useSendFriendRequest(user)
  const [notification, setNotification] = useState(null)

  const loadMoreResults = () => {
    setPage(page + 1)
  }

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  })

  if (user) userId = user._id

  // Handles sending a friend request
  const handleSendFriendRequest = async (username) => {
    const result = await sendFriendRequest(username)
    if (result) {
      setSentRequests([...sentRequests, username])
      setNotification(`Friend request sent to ${username}`)
    } else {
      setNotification(`Failed to send friend request to ${username}`)
    }
  }

  return (
    <>
      {notification && <ErrorBanner error={notification} type="success" />}
      <View style={styles.container}>
        <TextInput
          value={searchInput}
          style={theme.inputBox}
          onChangeText={setSearchInput}
          placeholder="Search for a user"
        />
        {searchInput && (
          <FlatList
            onEndReached={loadMoreResults}
            onEndReachedThreshold={0.5}
            data={searchResults}
            keyExtractor={item => item._id.toString()}
            renderItem={({ item }) => {

              item.pendingFriendRequests
              return (
                <View style={styles.listItem}>
                  <Image
                    source={item.profilePicture ? { uri: item.profilePicture } : defaultProfilePicture}
                    style={styles.listingProfilePicture}
                  />
                  <Text style={styles.listItemText}> {item.username}</Text>
                  <Icon.Button
                    name="user-plus"
                    backgroundColor="transparent"
                    color={user && user.friends.includes(item._id) ? 'green' :
                      (sentRequests.includes(item.username) ||
                    item.pendingFriendRequests.some(request =>
                      (request.sender === userId || request.receiver === userId) && request.status !== 'DECLINED'
                    )) ? 'gray' : 'blue'}
                    onPress={() => handleSendFriendRequest(item.username)}
                    // Disable the request, if the user is already a friend or if the request has already been sent
                    disabled={user && user.friends.includes(item.username) ||
                      sentRequests.includes(item.username) ||
                      item.pendingFriendRequests.some(request =>
                        (request.sender === userId || request.receiver === userId) && request.status !== 'DECLINED'
                      )}
                  />
                </View>
              )
            }}
          />
        )}
      </View>
    </>
  )
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 16,
  },
  listingProfilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
  },
})


export default SearchForUser
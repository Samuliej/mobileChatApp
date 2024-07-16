import React, { useContext, useEffect  } from 'react'
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from 'react-native'
import { NotificationContext } from '../../Context/NotificationContext.js'
import { useNavigation } from '@react-navigation/native'
import ErrorBanner from '../Error/index.jsx'
import useFriendRequests from '../../hooks/useFriendRequests.js'
import FriendRequestsList from './FriendRequestsList/index.jsx'
const emptyIcon = require('../../../assets/fist-bump.png')

/**
 * FriendRequests is a React component that displays the list of friend requests.
 * It uses the NotificationContext to display notifications and the useFriendRequests hook
 * to handle friend request logic, including accepting and declining requests.
 *
 * The component conditionally renders:
 * - An error banner if there is a notification.
 * - A message and a button to navigate to the user search page if there are no friend requests.
 * - A list of FriendRequestsList components, each representing a friend request, if there are any friend requests.
 *
 * useEffect Hook:
 * - Clears the notification after 3 seconds.
 *
 * Props: None
 *
 * Returns:
 * - A ScrollView that contains either a message indicating there are no new friend requests
 *   with a button to navigate to the search page, or a list of friend requests.
 *
 * Note:
 * - The component uses the useNavigation hook from @react-navigation/native for navigation.
 * - The styles object at the bottom of the file defines the styling for the component's elements.
 */
const FriendRequests = () => {
  const notificationContextValue = useContext(NotificationContext)
  const { notification, setNotification } = notificationContextValue

  const { handleAccept, handleDecline, friendRequests  } = useFriendRequests(setNotification)

  const navigation = useNavigation()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotification('')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [notification])

  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
    >
      {notification && <ErrorBanner error={notification} type="success" />}
      <View style={styles.container}>
        {friendRequests.length === 0 && (
          <View style={styles.emptyContainer}>
            <Image source={emptyIcon} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>
              {"Looks like there's no new friend requests, no worries, you can navigate to search for a user page and start making connections!"}
            </Text>
            <Pressable style={styles.goButton} onPress={() => navigation.navigate('Search for a User')}>
              <Text style={styles.buttonText}>Go!</Text>
            </Pressable>
          </View>
        )}
        {friendRequests.length > 0 && (
          <>
            {friendRequests.map(request => (
              <FriendRequestsList
                key={request.userObj._id}
                request={request}
                handleAccept={handleAccept}
                handleDecline={handleDecline}
              />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  )
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
  goButton: {
    marginTop: 16,
    backgroundColor: '#6495ED',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
})

export default FriendRequests
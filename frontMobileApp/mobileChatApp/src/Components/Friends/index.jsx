import React from 'react'
import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
const emptyIcon = require('../../../assets/fist-bump.png')
import FriendItem from './FriendItem.jsx'
import useFriends from '../../hooks/useFriends.js'


/**
 * Friends is a React component that displays a list of friends or a message indicating no friends are available.
 * It uses a custom hook, useFriends, to fetch the list of friends and displays them using the FriendItem component.
 * If the list is empty, it shows a message and a button to navigate to the search page.
 *
 * Hooks:
 * - useFriends: Custom hook to fetch the list of friends and loading state.
 * - useNavigation: Hook from React Navigation to access the navigation object for navigating between screens.
 *
 * Returns:
 * - A loading indicator if the friends list is being fetched.
 * - A message and a button to navigate to the search page if the friends list is empty.
 * - A ScrollView with a list of FriendItem components if there are friends.
 *
 * Note:
 * - The friends list is sorted alphabetically by username before being displayed.
 * - The component handles loading state and empty state, providing feedback to the user in both cases.
 */
const Friends = () => {
  const { friends, loading } = useFriends()
  const navigation = useNavigation()
  let sortedFriends
  friends ? sortedFriends = friends.sort((a, b) => a.username.localeCompare(b.username)) : null

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {friends.length === 0 && (
        <View style={styles.emptyContainer}>
          <Image source={emptyIcon} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>
            {"Looks like you don't have any friends yet, no worries, you can navigate to search for a user page and start making connections!"}
          </Text>
          <Pressable style={styles.goButton} onPress={() => navigation.navigate('Search for a User')}>
            <Text style={styles.buttonText}>Go!</Text>
          </Pressable>
        </View>
      )}
      {sortedFriends.length > 0 && (
        <ScrollView>
          {sortedFriends.map(friend => (
            <FriendItem key={friend._id} friend={friend} navigation={navigation} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  goButton: {
    marginTop: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Friends
import React from 'react'
import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
const emptyIcon = require('../../../assets/fist-bump.png')
import FriendItem from './FriendItem.jsx'
import useFriends from '../../hooks/useFriends.js'

/*

  Component for displaying all the friends of the user.
  The component is updated in real-time with socket.io
  You can navigate to a single friend's info and posts displaying component from here also.

*/

const Friends = () => {
  const { friends, loading } = useFriends()
  const navigation = useNavigation()

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
      {friends.length > 0 && (
        <ScrollView>
          {friends.map(friend => (
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
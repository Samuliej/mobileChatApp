import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, Pressable, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native'
import { UserContext } from '../../Context/UserContext.js'
import { NotificationContext } from '../../Context/NotificationContext.js'
import { FriendRequestContext } from '../../Context/FriendRequestContext.js'
import { SocketContext } from '../../Context/SocketContext.js'
import api from '../../api.js'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorBanner from '../Error/index.jsx'
const emptyIcon = require('../../../assets/fist-bump.png')
const defaultProfilePicture = require('../../../assets/soldier.png')

const FriendRequests = () => {
  const userContextValue = useContext(UserContext)
  const { user, updateUserPendingRequests, updateUser } = userContextValue

  const notificationContextValue = useContext(NotificationContext)
  const { notification, setNotification } = notificationContextValue

  const friendRequestContextValue = useContext(FriendRequestContext)
  const { friendRequests, setFriendRequests } = friendRequestContextValue

  const socket = useContext(SocketContext)
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()
  let pendingRequests = []
  if (user) pendingRequests = user.pendingFriendRequests.filter(request => request.receiver === user._id)

  const fetchRequests = async () => {
    setRefreshing(true)
    if (user) {
      // Fetch all requests
      const fetchedRequests = await Promise.all(pendingRequests.map(async (request) => {
        const response = await api.get(`/api/users/id/${request.sender}`)
        const senderUser = await response.data
        return {
          ...request,
          userObj: senderUser,
        }
      }))

      // Filter out 'ACCEPTED' requests
      const filteredRequests = fetchedRequests.filter(request => request.status !== 'ACCEPTED')

      setFriendRequests(filteredRequests)
    }
    setRefreshing(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [user ? user.pendingFriendRequests : null])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotification('')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [notification])

  const handleAccept = async (username, friendshipId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken')
      socket.emit('acceptFriendRequest', { friendshipId, token: userToken })

      // Update the requests state to remove the accepted request
      const newRequests = friendRequests.filter(request => request._id !== friendshipId)
      setFriendRequests(newRequests)
      updateUserPendingRequests(newRequests)
      updateUser(userToken)

      // Inform that the friend request has been accepted
      socket.emit('friendRequestAccepted', {username, userToken})

      // I have to include this because for some reason updating the user
      // object redirects to the home page
      navigation.navigate('Friend requests')
      setNotification(`Accepted friend request from ${username}`)
    } catch (error) {
      console.error(`Error accepting friend request from ${username}: `, error)
    }
  }

  const handleDecline = (username, friendshipId) => {
    Alert.alert(
      "Decline Friend Request",
      `Are you sure you want to decline the friend request from ${username}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const userToken = await AsyncStorage.getItem('userToken')
              await api.put(`/api/declineFriendRequest/${friendshipId}`, {}, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                }
              })
              // Update the requests state to remove the declined request
              const newRequests = friendRequests.filter(request => request._id !== friendshipId)
              setFriendRequests(newRequests)
              updateUserPendingRequests(newRequests)
              updateUser(userToken)
              // I have to include this because for some reason updating the user
              // object redirects to the home page
              navigation.navigate('Friend requests')
              setNotification(`Declined friend request from ${username}`)
            } catch (error) {
              console.error(`Error declining friend request from ${username}: `, error)
            }
          }
        }
      ]
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchRequests}
        />
      }
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
              <View key={request.userObj._id} style={styles.requestItem}>
                <Image source={request.userObj.profilePicture ? { uri: request.userObj.profilePicture } : defaultProfilePicture} style={styles.profileImage} />
                <Text style={styles.username}>{request.userObj.username}</Text>
                <View style={styles.buttons}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.acceptButton,
                      { opacity: pressed ? 0.5 : 1 }
                    ]}
                    onPress={() => handleAccept(request.userObj.username, request._id)}>
                    <Text style={styles.buttonText}>✓</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.declineButton,
                      { opacity: pressed ? 0.5 : 1 }
                    ]}
                    onPress={() => handleDecline(request.userObj.username, request._id)}>
                    <Text style={styles.navigateButtonText}>X</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  )
}

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
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  username: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  acceptButton: {
    backgroundColor: 'green',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 10,
  },
  declineButton: {
    backgroundColor: 'red',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
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
})

export default FriendRequests
import { useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api.js'
import { SocketContext } from '../Context/SocketContext.js'
import { useNavigation } from '@react-navigation/native'
import { FriendRequestContext } from '../Context/FriendRequestContext.js'
import { UserContext } from '../Context/UserContext.js'


/**
 * Custom hook for managing friend requests in a React application.
 * It handles fetching friend requests, accepting, and declining friend requests.
 * It also integrates with React Navigation for navigation and uses sockets for real-time updates.
 *
 * @param {Function} setNotification - Function to set notifications for the user.
 * @returns {object} An object containing:
 *                  - fetchRequests: Function to fetch friend requests.
 *                  - handleAccept: Function to accept a friend request.
 *                  - handleDecline: Function to decline a friend request.
 *                  - friendRequests: Array of current friend requests.
 *                  - setFriendRequests: Function to update the friend requests state.
 *
 * @example
 * const { fetchRequests, handleAccept, handleDecline, friendRequests, setFriendRequests } = useFriendRequests(setNotification);
 */
const useFriendRequests = (setNotification) => {
  const socket = useContext(SocketContext)
  const navigation = useNavigation()
  const friendRequestContextValue = useContext(FriendRequestContext)
  const { friendRequests, setFriendRequests } = friendRequestContextValue

  const userContextValue = useContext(UserContext)
  const { user, updateUserPendingRequests, updateUser } = userContextValue

  // Function for fetching friend requests
  const fetchRequests = async () => {
    if (user) {
      const pendingRequests = user.pendingFriendRequests.filter(request => request.receiver === user._id)
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
  }

  // Function for accepting friend requests
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

  // Function for handling declining friend request
  const handleDecline = async (username, friendshipId) => {
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

  useEffect(() => {
    fetchRequests()
  }, [user ? user.pendingFriendRequests : null])

  return { fetchRequests, handleAccept, handleDecline, friendRequests, setFriendRequests }
}

export default useFriendRequests
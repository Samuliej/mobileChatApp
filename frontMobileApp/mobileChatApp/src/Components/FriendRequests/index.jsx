import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { UserContext } from '../../Context/UserContext.js'
import api from '../../api.js'
import { useNavigation } from '@react-navigation/native'
const emptyIcon = require('../../../assets/fist-bump.png')
const defaultProfilePicture = require('../../../assets/soldier.png')

const FriendRequests = () => {
  const { user } = useContext(UserContext)
  const [requests, setRequests] = useState([])
  const navigation = useNavigation()
  let pendingRequests = user.pendingFriendRequests.filter(request => request.receiver === user._id)

  useEffect(() => {
    const fetchRequests = async () => {
      const fetchedRequests = await Promise.all(pendingRequests.map(async (request) => {
        const response = await api.get(`/api/users/id/${request.sender}`)
        const senderUser = await response.data
        return senderUser
      }))

      setRequests(fetchedRequests)
    }

    fetchRequests()
  }, [user.pendingFriendRequests])

  const handleAccept = (username) => {
    console.log(`Accepted friend request from ${username}`)
  }

  const handleDecline = (username) => {
    console.log(`Declined friend request from ${username}`)
  }

  return (
    <View style={styles.container}>
      {requests.length === 0 && (
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
      {requests.length > 0 && (
        <>
          {requests.map(requestSender => (
            <View key={requestSender._id} style={styles.requestItem}>
              <Image source={requestSender.profilePicture ? { uri: requestSender.profilePicture } : defaultProfilePicture} style={styles.profileImage} />
              <Text style={styles.username}>{requestSender.username}</Text>
              <View style={styles.buttons}>
                <Pressable style={styles.acceptButton} onPress={() => handleAccept(requestSender.username)}>
                  <Text style={styles.buttonText}>✓</Text>
                </Pressable>
                <Pressable style={styles.declineButton} onPress={() => handleDecline(requestSender.username)}>
                  <Text style={styles.navigateButtonText}>X</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
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
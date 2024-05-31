import React, { useState, useContext, useEffect } from 'react'
import { View, TextInput, Text, FlatList, StyleSheet, Image } from 'react-native'
import { useSearchUser } from '../../hooks/useSearchUser'
import theme from '../../theme.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import defaultProfilePicture from '../../../assets/soldier.png'
import useSendFriendRequest from '../../hooks/useSendFriendRequest'
import { UserContext } from '../../Context/UserContext.js'
import ErrorBanner from '../Error/index.jsx'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon

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

  const handleSendFriendRequest = async (username) => {
    const result = await sendFriendRequest(username)
    console.log('result at SearchForUser:', result)
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
            //onEndReachedThreshold={0.5}
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
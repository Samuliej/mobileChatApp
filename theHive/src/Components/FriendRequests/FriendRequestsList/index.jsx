import { View, Image, Text, Pressable, StyleSheet } from 'react-native'
const defaultProfilePicture = require('../../../../assets/soldier.png')

/**
 * FriendRequestsList is a React component that displays a single friend request item.
 *
 * Props:
 * - request: Object. Contains information about the friend request, including the user object and request ID.
 * - handleAccept: Function. A callback function that is called when the accept button is pressed. It takes the username and request ID as arguments.
 * - handleDecline: Function. A callback function that is called when the decline button is pressed. It takes the username and request ID as arguments.
 *
 * The component displays the requester's profile picture (or a default picture if none is provided), username, and provides buttons to accept or decline the friend request.
 *
 * Returns:
 * - A View component containing the friend request item, including the profile picture, username, and action buttons.
 */
const FriendRequestsList = ({ request, handleAccept, handleDecline }) => {

  return (
    <View style={styles.requestItem}>
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
          <Text style={{ color: 'white', fontSize: 20 }}>X</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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

})

export default FriendRequestsList
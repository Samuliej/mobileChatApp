import { View, Text, StyleSheet } from 'react-native'
import { formatTimestamp } from '../../../../utils/utils'

const MessageItem = ({ item, user }) => {
  if (!item) {
    return null
  }
  if (!item._id) {
    // Item doesn't have an ID, generate a temporary one
    item._id = Math.random().toString(36).substr(2, 9)
  }

  const formattedDate = formatTimestamp(item.timestamp)

  // Variable for figuring out whether the message is sent by the current user
  const isMyMessage = user && item.sender === user._id

  return (
    <View style={isMyMessage ? styles.myMessageContainer : styles.messageContainer}>
      <View key={item._id} style={[styles.messageItem, isMyMessage ? styles.myMessage : styles.friendMessage]}>
        <Text>{item.content}</Text>
        <Text style={styles.timestamp}>{formattedDate} {item.status}</Text>
        <View style={isMyMessage ? styles.myMessageTail : styles.friendMessageTail}></View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  myMessageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingRight: 10
  },
  messageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 12
  },
  messageItem: {
    flexDirection: 'column',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#77e67c',
    paddingLeft: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  friendMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timestamp: {
    marginTop: 2,
    fontSize: 8,
    color: 'black',
    alignSelf: 'flex-end',
  },
  myMessageTail: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#77e67c',
  },
  friendMessageTail: {
    position: 'absolute',
    bottom: 0,
    left: -10,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#eee',
  },
})

export default MessageItem
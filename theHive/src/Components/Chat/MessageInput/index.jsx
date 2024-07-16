import { useRef, useState } from 'react'
import { View, TextInput,Pressable, StyleSheet, Animated } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import theme from '../../../theme'

/**
 * MessageInput is a React component for rendering an input field with an animated send button.
 * It allows users to type messages, dynamically adjusts its height based on the content, and provides an animated feedback when sending a message.
 *
 * Props:
 * - newMessage: string. The current message text.
 * - setNewMessage: function. Function to update the state of the message text.
 * - sendMessage: function. Function to be called when the send button is pressed.
 *
 * State:
 * - inputHeight: number. The dynamic height of the input field based on the content size.
 *
 * Refs:
 * - scaleValue: Animated.Value. Used to control the scale animation of the send button.
 *
 * The component consists of a TextInput for the message input and an Animated.View containing a Pressable with an Icon for the send button.
 * The send button uses an animation to scale down and back up when pressed, providing visual feedback.
 * The TextInput's height adjusts dynamically to fit the content, improving the user experience by avoiding text overflow.
 *
 * Styles are defined for the input container, input field, and send button to ensure a visually appealing layout.
 */
const MessageInput = ({ newMessage, setNewMessage, sendMessage }) => {
  const [inputHeight, setInputHeight] = useState(35)
  const scaleValue = useRef(new Animated.Value(1)).current

  const animateSendButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 0.5, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      if (newMessage.length !== 0) sendMessage()
    })
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, { height: Math.max(35, inputHeight) }]}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type a message..."
        multiline
        onContentSizeChange={(event) => setInputHeight(event.nativeEvent.contentSize.height)}
      />
      <Animated.View style={[styles.sendButton, { transform: [{ scale: scaleValue }] }]}>
        <Pressable onPress={animateSendButton}>
          <Icon name="send" size={24} color="white" />
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F8F6F0',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: theme.platformStyle.color,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export default MessageInput
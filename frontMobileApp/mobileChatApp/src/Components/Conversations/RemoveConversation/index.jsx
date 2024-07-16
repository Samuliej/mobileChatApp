import { View, Text, Pressable, StyleSheet } from 'react-native'

/**
 * RemoveConversation is a React component that renders a confirmation bar for removing a conversation.
 * It displays the name of the friend associated with the selected conversation and provides "Remove" and "Cancel" options.
 *
 * Props:
 * - selectedConversation: Object. The conversation currently selected for potential removal. It should contain at least a `friend` object with a `name` property.
 * - handleRemoveConversation: Function. A callback function that is called when the user confirms the removal of the conversation.
 * - handleCancelRemoveConversation: Function. A callback function that is called when the user cancels the removal of the conversation.
 *
 * The component:
 * - Displays a red bar with a message asking for confirmation to remove the conversation with the friend's name.
 * - Includes two pressable text elements: "Remove" and "Cancel".
 *   - "Remove" calls `handleRemoveConversation` when pressed.
 *   - "Cancel" calls `handleCancelRemoveConversation` when pressed.
 *
 * Returns:
 * - A View component containing the confirmation message and options to remove or cancel the action.
 */
const RemoveConversation = ({selectedConversation, handleRemoveConversation, handleCancelRemoveConversation}) => {

  return (
    <View style={styles.redBar}>
      <Text style={styles.redBarText}>Remove conversation with {selectedConversation.friend.name}?</Text>
      <Pressable onPress={handleRemoveConversation}>
        <Text style={[styles.redBarText, { borderWidth: 1, borderColor: '#000', borderRadius: 5, padding: 3 }]}>Remove</Text>
      </Pressable>
      <Pressable onPress={handleCancelRemoveConversation}>
        <Text style={[styles.redBarText, { borderWidth: 1, borderColor: '#000', borderRadius: 5, padding: 3 }]}>Cancel</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  redBar: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 3,
    marginBottom: 5
  },
  redBarText: {
    color: '#fff',
  },

})

export default RemoveConversation
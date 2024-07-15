import { View, Text, Pressable, StyleSheet } from 'react-native'

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
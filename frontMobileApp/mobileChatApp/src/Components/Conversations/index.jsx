import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const Conversations = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>This is the Conversations Screen</Text>
      <Pressable
        style={styles.fab}
        onPress={() => {
          // Handle the press event
          console.log('New conversation button pressed')
          //navigation.navigate('NewConversation') // replace with your screen
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8
  },
})

export default Conversations
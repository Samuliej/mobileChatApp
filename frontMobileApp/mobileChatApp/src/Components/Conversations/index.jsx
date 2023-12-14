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
        <View style={styles.iconContainer}>
          <Ionicons name="chatbubbles-outline" size={30} color="white" />
          <Ionicons name="add" size={24} color="white" style={styles.plusIcon} />
        </View>
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
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 35,
    elevation: 8
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    position: 'absolute',
    left: 20,
    top: 15
  },
})

export default Conversations
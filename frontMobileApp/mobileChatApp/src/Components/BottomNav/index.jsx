import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'

const BottomNavBar = () => {
  const [selected, setSelected] = useState('Chat')

  const Button = ({ title }) => (
    <Pressable
      style={[styles.button, selected === title && styles.buttonSelected]}
      onPress={() => setSelected(title)}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  )

  return (
    <View style={styles.container}>
      <Button title="Chat" />
      <Button title="Friends" />
      <Button title="Settings" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#ddd',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonSelected: {
    backgroundColor: '#bbb',
  },
  text: {
    fontSize: 18,
  },
})

export default BottomNavBar
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>This is a Feed Screen</Text>
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
})
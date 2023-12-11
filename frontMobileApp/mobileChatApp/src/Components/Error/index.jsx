import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

/**
 *
 * Simple component to display an error message.
 *
 */
const ErrorBanner = ({ error }) => {
  return (
    <View style={styles.errorBanner}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  errorBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 10,
    zIndex: 1,
    width: '100%',
    borderRadius: 15
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
})

export default ErrorBanner

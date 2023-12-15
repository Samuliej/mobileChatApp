import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

/**
 *
 * Simple component to display an error message.
 *
 */
const ErrorBanner = ({ error, type = 'error' }) => {
  return (
    <View style={[styles.errorBanner, type === 'success' && styles.successBanner]}>
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
    borderRadius: 15,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    alignSelf: 'center', // Center the banner horizontally within its parent
  },
  successBanner: {
    backgroundColor: 'green',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
})

export default ErrorBanner
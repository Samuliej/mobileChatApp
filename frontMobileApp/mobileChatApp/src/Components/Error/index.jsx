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

// Styles

const styles = StyleSheet.create({
  errorBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.65)',
    padding: 10,
    zIndex: 1,
    width: '100%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
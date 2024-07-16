import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

/**
 * ErrorBanner is a React component that displays an error or success message banner.
 *
 * Props:
 * - error: String. The message to be displayed in the banner.
 * - type: String (optional). The type of banner, which can be 'error' or 'success'. Defaults to 'error'.
 *
 * The component conditionally applies styling based on the `type` prop to differentiate between error and success messages.
 * The default style displays a red background for errors, while a green background is used for success messages.
 *
 * Returns:
 * - A View component containing the Text component that displays the error or success message.
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
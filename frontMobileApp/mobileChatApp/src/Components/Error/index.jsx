import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const ErrorBanner = ({ error }) => {
  return (
    <View style={styles.errorBanner}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  errorBanner: {
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
})

export default ErrorBanner

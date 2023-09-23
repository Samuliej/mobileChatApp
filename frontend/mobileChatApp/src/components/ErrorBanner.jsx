import { View, Text, StyleSheet } from 'react-native'

/*

  Component for displaying errors

*/

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    padding: 10,
  },
  message: {
    color: 'white',
    padding: 10
  }
})

const ErrorBanner = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

export default ErrorBanner
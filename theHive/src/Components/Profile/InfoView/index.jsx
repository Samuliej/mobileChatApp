import { View, Text, StyleSheet } from 'react-native'


/**
 * InfoView is a React component that displays user information in a styled view.
 *
 * Props:
 * - user: An object containing user information. Expected to have `username`, `name`, `phone`, and `city` properties.
 *
 * Behavior:
 * - Renders a view containing several text elements, each displaying a piece of user information.
 *
 */
const InfoView = ({user}) => {
  return (
    <View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Username: {user.username}</Text>
        <Text style={styles.infoText}>Name: {user.name}</Text>
        <Text style={styles.infoText}>Phone: {user.phone}</Text>
        <Text style={styles.infoText}>City: {user.city}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginHorizontal: 20,
    marginTop: 20,
  },
  infoText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
    textAlign: 'left',
  },
})

export default InfoView
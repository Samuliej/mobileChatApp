import { StyleSheet, View, Text, TextInput } from 'react-native'
import CustomButton from '../../SignIn/CustomButton'
import theme from '../../../theme'

/**
 * EditView is a React component for rendering and managing a form where users can edit their name, phone, and city information.
 *
 * Props:
 * - name: The current name value.
 * - setName: Function to set the new name value.
 * - phone: The current phone value.
 * - setPhone: Function to set the new phone value.
 * - city: The current city value.
 * - setCity: Function to set the new city value.
 * - handleSave: Function to be called when the save button is pressed.
 *
 * Behavior:
 * - Displays text inputs for the user's name, phone, and city, pre-filled with current values.
 * - Each input updates its respective state (name, phone, city) on change.
 * - A "Save" button is provided to submit the changes, which triggers the `handleSave` function.
 *
 */
const EditView = ({name, setName, phone, setPhone, city, setCity, handleSave}) => {

  return (
    <View>
      <View style={{ alignItems: 'center' }}>
        <Text>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
        <Text>Phone</Text>
        <TextInput style={styles.input} value={phone} keyboardType='phone-pad' onChangeText={setPhone} placeholder="Phone" />
        <Text>City</Text>
        <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />
      </View>
      <CustomButton style={[{ marginTop: 10, marginBottom: 20, marginHorizontal: 50 }, {...theme.shadow}]} onPress={handleSave} title='Save' />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    fontSize: 18,
    marginBottom: 12,
  },
})

export default EditView
import { StyleSheet, View, Text, TextInput } from 'react-native'
import CustomButton from '../../SignIn/CustomButton'
import theme from '../../../theme'

/**
 * Renders the EditView component with fields for name, phone, and city, along with a save button.
 *
 * @param {string} name - The name value to display and update
 * @param {function} setName - The function to set the name value
 * @param {string} phone - The phone value to display and update
 * @param {function} setPhone - The function to set the phone value
 * @param {string} city - The city value to display and update
 * @param {function} setCity - The function to set the city value
 * @param {function} handleSave - The function to handle the save action
 * @return {JSX.Element} The rendered EditView component
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
import { View, Image, TextInput, Text, StyleSheet, Dimensions } from 'react-native'
import CustomButton from '../CustomButton'
import { useNavigation } from '@react-navigation/native'
import theme from '../../../theme'
// Sign in icon from:
// <a href="https://www.flaticon.com/free-icons/honeycomb" title="honeycomb icons">Honeycomb icons created by PIXARTIST - Flaticon</a>
const icon = require('../../../../assets/honeycomb.png')
const height = Dimensions.get('window').height

/**
 * SignInView is a functional component that renders the sign-in form interface.
 * It includes input fields for username and password, validation error messages, and buttons for sign-in and registration.
 *
 * Props:
 * @param {string} username - The current value of the username input field.
 * @param {Function} setUsername - Function to set the username state.
 * @param {string} password - The current value of the password input field.
 * @param {Function} setPassword - Function to set the password state.
 * @param {Function} setUsernameError - Function to set the username error message.
 * @param {Function} setPasswordError - Function to set the password error message.
 * @param {Function} handleSignIn - Function to handle the sign-in process.
 * @param {string} usernameError - The current username validation error message.
 * @param {string} passwordError - The current password validation error message.
 * @param {Function} validateField - Function to validate a field and return an error message if invalid.
 *
 * The component uses the `useNavigation` hook from `react-navigation` to navigate to the SignUp screen.
 * It also trims the username and password input fields on blur and validates them using the `validateField` function.
 * If validation fails, it sets the appropriate error message which is displayed below the input field.
 *
 * The `CustomButton` component is used for the sign-in and register buttons, styled according to the application's theme.
 *
 */
const SignInView = ({ username, setUsername, password, setUsernameError, setPasswordError,
  setPassword, handleSignIn, usernameError, passwordError, validateField }) => {
  const navigation = useNavigation()

  return (
    <>
      <View style={[styles.container, { marginTop: height/7 }]}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={icon}
            style={{ width: 90, height: 90 }}
          />
        </View>
        <TextInput
          style={styles.inputBox}
          value={username}
          onChangeText={setUsername}
          onBlur={() => {
            const trimmedUsername = username.trim()
            setUsername(trimmedUsername)
            const errorMessage = validateField('username', trimmedUsername)
            if (errorMessage) {
              setUsernameError(errorMessage)
              setTimeout(() => {
                setUsernameError('')
              }, 3500)
            } else {
              setUsernameError('')
            }
          }}
          placeholder='Username'
        />
        {usernameError ? <Text style={{ color: 'red' }}>{usernameError}</Text> : null}
        <TextInput
          style={styles.inputBox}
          value={password}
          onChangeText={setPassword}
          onBlur={() => {
            const trimmedPassword = password.trim()
            setPassword(trimmedPassword)
            const errorMessage = validateField('password', trimmedPassword)
            if (errorMessage) {
              setPasswordError(errorMessage)
              setTimeout(() => {
                setPasswordError('')
              }, 3500)
            } else {
              setPasswordError('')
            }
          }}
          placeholder='Password'
          secureTextEntry={true}
        />
        {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
        <CustomButton style={{ marginTop: 10 }} onPress={handleSignIn} title='Sign in' />
        <Text style={{ marginBottom: 10, marginTop: 30, textAlign: 'center' }}>{"Don't have an account?"}</Text>
        <CustomButton title='Register' style={{ backgroundColor: 'black' }}
          onPress={() => navigation.navigate('SignUp')} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputBox: theme.inputBox,
})

export default SignInView
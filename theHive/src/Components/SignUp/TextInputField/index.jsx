import { Text, TextInput, StyleSheet } from 'react-native'

/**
 * TextInputField is a React component designed for input collection within forms.
 * It encapsulates a text input field with customizable properties such as secure text entry for passwords and dynamic keyboard types for different input needs.
 *
 * Features:
 * - Displays a label above the input field for clarity.
 * - Supports secure text entry, making it suitable for password inputs.
 * - Allows for custom keyboard types to accommodate various data inputs like email, numeric, etc.
 * - Shows error messages directly below the input field to provide immediate feedback.
 *
 * Props:
 * - label: The text label displayed above the input field for identification.
 * - value: The current value of the input field, making the component controlled.
 * - onChangeText: Callback function triggered with the input value changes.
 * - onBlur: Callback function triggered when the input field loses focus, useful for validation.
 * - placeholder: A placeholder text shown in the input field before any input is entered.
 * - secureTextEntry: Enables secure text entry for sensitive information like passwords. Defaults to false.
 * - error: An error message to display below the input field. If present, it indicates validation failure.
 * - textMargin: Style prop to customize the margin of the text label.
 * - keyboardType: Specifies the type of keyboard to display for the input. Allows for more specific data input types.
 *
 * Usage:
 * - Ideal for forms requiring user input, especially where validation and secure data entry are necessary.
 * - Can be easily integrated into larger form structures and supports both standard and custom validation feedback.
 */
const TextInputField = ({
  label, value, onChangeText, onBlur, placeholder,
  secureTextEntry = false, error, textMargin, keyboardType = null
}) => (
  <>
    <Text style={textMargin}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      secureTextEntry={secureTextEntry}
      placeholder={placeholder}
      keyboardType={keyboardType}
    />
    {error && <Text style={{ color: 'red' }}>{error}</Text>}
  </>
)

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
})

export default TextInputField
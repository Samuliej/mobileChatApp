import { Text, TextInput, StyleSheet } from 'react-native'

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
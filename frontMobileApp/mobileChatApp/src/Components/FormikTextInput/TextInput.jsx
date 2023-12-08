import { TextInput as NativeTextInput } from "react-native"
import Text from "../Text"
import theme from "../../theme"

const TextInput = ({ style, error, ...props }) => {
  const textInputStyle = [style, error && { borderColor: 'red' }]

  return (
    <>
      <NativeTextInput style={textInputStyle} {...props} />
      {error && <Text style={theme.errorText}>{error}</Text>}
    </>
  )
}

export default TextInput
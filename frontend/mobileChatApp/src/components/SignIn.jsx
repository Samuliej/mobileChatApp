import { Formik } from "formik"
import { View, StyleSheet, Pressable } from "react-native"
import FormikTextInput from "./FormikTextInput"
import theme from "../theme"
import Text from "../Text"

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:16,
    paddingTop: 16
  },
  button: theme.button,
  buttonText: theme.buttonText
})

const initialValues = {
  username: '',
  password: ''
}

const SignInView = () => {

  const onSubmit = () => {
    console.log('submittas')
  }

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        //validationSchema={}
      >
        {({ handleSubmit, isValid }) => (
          <>
            <FormikTextInput name='username' placeholder='Username' />
            <FormikTextInput name='password' placeholder='Password' secureTextEntry={true} />
            <Pressable
              style={styles.button}
              onPress={() => isValid ? handleSubmit(): null}
            >
              <Text style={styles.buttonText}>Sign in</Text>
            </Pressable>
          </>
        )}
      </Formik>
      </View>
  )
}

export default SignInView
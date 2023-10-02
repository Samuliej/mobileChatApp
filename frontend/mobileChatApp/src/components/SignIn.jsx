import { Formik } from "formik"
import { View, StyleSheet, Pressable } from "react-native"
import FormikTextInput from "./FormikTextInput"
import theme from "../theme"
import Text from "../Text"
import * as yup from 'yup'
import useSignIn from "../hooks/useSignIn"
import { useNavigate } from "react-router-native"
import { useEffect, useState } from "react"
import ErrorBanner from "./ErrorBanner"

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

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required')
})

const SignInView = ({ onSubmit }) => {

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
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

const SignIn = () => {
  const [signIn] = useSignIn()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null)
      }, 10000)

      return () => clearTimeout(timeout)
    }
  })

  const handleSignIn = async (values) => {
    const { username, password } = values
    try {
      const data = await signIn({ username, password })
      if (data) {
        navigate('/')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <SignInView onSubmit={handleSignIn} />
    </>
  )
}

export default SignIn
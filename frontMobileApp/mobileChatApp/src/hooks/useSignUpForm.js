import { useState } from 'react'
import * as yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import useSignUp from '../hooks/useSignUp'
import useSignIn from '../hooks/useSignIn'

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
  name: yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
})


/**
 * Custom hook for managing the sign-up form state and interactions.
 * It integrates form validation, image selection for profile pictures, and sign-up/sign-in functionalities.
 *
 * @returns {object} An object containing state management functions and values for:
 *                  - username, password, confirmPassword, name, phone, city, profilePicture, image: Form fields.
 *                  - usernameError, passwordError, nameError: Error messages for the respective form fields.
 *                  - passwordsMatch: A boolean indicating if the password and confirmPassword match.
 *                  - setUsername, setPassword, setConfirmPassword, setName, setPhone, setCity, setProfilePicture, setImage: Functions to update form fields.
 *                  - setUsernameError, setPasswordError, setNameError, setPasswordsMatch: Functions to update error messages and password match status.
 *                  - validateField: Function to validate a single form field.
 *                  - validateConfirmPassword: Function to check if password and confirmPassword match.
 *                  - selectImage: Async function to select an image from the device's library for the profile picture.
 *                  - deleteImage: Function to remove the selected profile picture.
 *                  - signUp, signIn: Functions imported from useSignUp and useSignIn hooks for user registration and login.
 *                  - loading: Boolean indicating if a sign-up or sign-in operation is in progress.
 *                  - signUpError, signInError: Error messages from sign-up or sign-in operations.
 *
 */
const useSignUpForm = () => {
  const { signUp, error: signUpError, loading } = useSignUp()
  const { signIn, error: signInError } = useSignIn()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [nameError, setNameError] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(null)
  const [image, setImage] = useState(null)

  const validateField = (field, values) => {
    try {
      yup.reach(validationSchema, field).validateSync(values[field])
    } catch (error) {
      return error.message
    }
  }

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Passwords don't match."
    }
  }

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.uri)
      let localUri = result.uri
      let filename = localUri.split('/').pop()

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename)
      let type = match ? `image/${match[1]}` : `image`
      setProfilePicture({ uri: localUri, name: filename, type })
    }
  }

  const deleteImage = () => {
    setImage(null)
    setProfilePicture(null)
  }

  return {
    username, setUsername, password, setPassword, confirmPassword, setConfirmPassword,
    name, setName, phone, setPhone, city, setCity, profilePicture, setProfilePicture,
    usernameError, setUsernameError, passwordError, setPasswordError,
    nameError, setNameError, passwordsMatch, setPasswordsMatch, image, setImage,
    validateField, validateConfirmPassword, selectImage, deleteImage,
    signUp, signIn, loading, signUpError, signInError
  }
}

export default useSignUpForm
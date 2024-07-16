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
import Constants from 'expo-constants'
import { View, Text, Pressable, StyleSheet, Image, Dimensions } from 'react-native'
import { useNavigate } from 'react-router-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useContext, useState } from 'react'
import { UserContext } from '../../Context/UserContext'
import testImage from '../../../test.jpg'

//const { width } = Dimensions.get('window')


/**
 * `NavBar` is a component that displays the navigation bar of the application.
 *
 * It uses several hooks and contexts:
 * - `UserContext`: This context provides the current user state and a function to update it.
 * - `useNavigate`: This hook from 'react-router-native' is used to programmatically navigate the user.
 * - `AsyncStorage`: Used to remove the user token persistently when signing out.
 *
 * The component contains a title that, when pressed, navigates the user to the main page.
 *
 * If the user is not signed in, it displays buttons to navigate to the Sign In and Sign Up pages.
 * If the user is signed in, it displays the user's username and a Sign Out button.
 *
 * The `handleSignOut` function is called when the Sign Out button is pressed. This function removes the user token from `AsyncStorage` and updates the user context to sign out the user.
 */
const NavBar = () => {
  const { user, updateUser } = useContext(UserContext)
  //const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleSignOut = async () => {
    // Clear the token from the storage
    await AsyncStorage.removeItem('userToken')
    // Update the user context
    await updateUser()
  }

  return (
    <View style={styles.navBar}>
      <Pressable onPress={() => console.log('dsa')}>
        <Text style={styles.title}>Mobile Chat App</Text>
      </Pressable>
      <View style={styles.actions}>
        {!user && (
          <>
            <Pressable style={styles.button} onPress={() => console.log('asdfdasf')}>
              <Text style={styles.action}>Sign In</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => console.log('Sign up')}>
              <Text style={styles.action}>Sign Up</Text>
            </Pressable>
          </>
        )}
        {user && (
          <>
            <Pressable title="Toggle Menu" onPress={toggleMenu}>
              <Image source={testImage} style={styles.profilePicture} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: Constants.statusBarHeight + 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
    borderRadius: 15
  },
  title: {
    color: '#000',
    fontSize: 20,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    textAlign: 'center',
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    width: 'inherit',
  },
  action: {
    color: '#000',
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backroundColor: 'lightblue',
    marginRight: 10,
  },
  menu: {
    textAlign: 'center',
    position: 'absolute',
    width: 300,  // Increase this value to move the menu to the right
    height: '100%',
    backgroundColor: 'lightblue',
    paddingTop: 10,
    paddingBottom: 10,
    right: 0,
    top: 50, // Adjust this value to the height of your navbar
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
})

export default NavBar
import AuthFlow from '../AuthFlow'
import { createStackNavigator } from '@react-navigation/stack'
import MyDrawer from '../MyDrawer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useContext, useEffect } from 'react'
import { SocketContext } from '../../Context/SocketContext.js'
import { UserContext } from '../../Context/UserContext.js'
import { FriendRequestContext } from '../../Context/FriendRequestContext.js'


const RootStack = createStackNavigator()

/**
 * RootNavigator is a React component that sets up the navigation for the application.
 * It uses a stack navigator to manage the authentication flow and the main drawer navigation.
 * Additionally, it sets up socket listeners to handle friend requests and updates the user's information accordingly.
 *
 * Contexts:
 * - Uses SocketContext to listen for friend request events.
 * - Uses UserContext to access and update the user's information.
 * - Uses FriendRequestContext to manage friend requests.
 *
 * Effects:
 * - On mount, sets up listeners for 'friendRequest', 'friendRequestSent', and 'friendRequestAccepted' events on the socket.
 * - On these events, it fetches the user token from AsyncStorage and updates the user's information.
 * - Cleans up the listeners on component unmount or when dependencies change.
 *
 * Navigation:
 * - Uses createStackNavigator to create a stack navigator.
 * - Defines two screens: 'Auth' for the authentication flow and 'Main' for the main drawer navigation.
 * - Hides the header for the stack navigator.
 *
 * Returns:
 * - A stack navigator with 'Auth' and 'Main' screens.
 */
const RootNavigator = () => {
  const socket = useContext(SocketContext)
  const { user, updateUser } = useContext(UserContext)
  const { setFriendRequests } = useContext(FriendRequestContext)

  useEffect(() => {
    if (user && socket) {
      const fetchTokenAndUpdateUser = async () => {
        const userToken = await AsyncStorage.getItem('userToken')
        if (userToken) {
          updateUser(userToken)
        }
      }

      // These 3 listeners handle updating the user whenever a friend request
      // is sent or accepted

      // This updates to the receiver
      socket.on('friendRequest', (newFriendshipToFront, callback) => {
        fetchTokenAndUpdateUser()
        callback()
      })

      // To the sender when the request is sent
      socket.on('friendRequestSent', () => {
        fetchTokenAndUpdateUser()
      })

      // To receiver and sender when a friend request is accepted
      socket.on('friendRequestAccepted', () => {
        fetchTokenAndUpdateUser()
      })

      // Clean up listeners on component unmount or when socket changes
      return () => {
        socket.off('friendRequest')
        socket.off('friendRequestSent')
        socket.off('friendRequestAccepted')
      }
    }
  }, [socket, user, updateUser, setFriendRequests])

  return (
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen name="Auth" component={AuthFlow} />
      <RootStack.Screen name="Main" component={MyDrawer} />
    </RootStack.Navigator>
  )
}

export default RootNavigator
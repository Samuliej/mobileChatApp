import AuthFlow from '../AuthFlow'
import { createStackNavigator } from '@react-navigation/stack'
import MyDrawer from '../MyDrawer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useContext, useEffect } from 'react'
import { SocketContext } from '../../Context/SocketContext.js'
import { UserContext } from '../../Context/UserContext.js'
import { FriendRequestContext } from '../../Context/FriendRequestContext.js'

/*

  Component for the main Stack navigator

*/

const RootStack = createStackNavigator()

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
      socket.on('friendRequest', (newFriendshipToFront, callback) => {
        fetchTokenAndUpdateUser()
        callback()
      })

      socket.on('friendRequestSent', () => {
        fetchTokenAndUpdateUser()
      })

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
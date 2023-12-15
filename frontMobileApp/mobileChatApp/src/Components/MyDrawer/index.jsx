import { useContext } from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { UserContext } from '../../Context/UserContext.js'
import { useNavigation } from '@react-navigation/native'
import { Image, Pressable, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon
import defaultProfilePicture from '../../../assets/soldier.png'
import MyTabs from '../MyTabs/index.jsx'
import SearchForUser from '../SearchForUser/index.jsx'
import FriendRequests from '../FriendRequests/index.jsx'

const Drawer = createDrawerNavigator()

const CustomHeader = ({ user }) => {
  const navigation = useNavigation()

  return (
    <Pressable onPress={() => navigation.toggleDrawer()}>
      <Image
        source={user && user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture}
        style={{ width: 40, height: 40, borderRadius: 20, paddingLeft: 5 }}
      />
    </Pressable>
  )
}

const CustomDrawerContent = (props) => {
  const { user, updateUser } = useContext(UserContext)
  const navigation = useNavigation()

  const handleSignOut = async () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to sign out?',
      [
        {
          text: 'No',
          onPress: () => console.log('No Pressed'), style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: async () => {
            // Clear the token from the storage
            await AsyncStorage.removeItem('userToken')
            // Update the user context
            await updateUser(null)

            navigation.navigate('Auth', { screen: 'NexusHive' })
          }
        },
      ],
      {cancelable: false},
      //clicking outside of alert will not cancel
    )
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {user &&(
        <>
          <DrawerItem
            label="Sign Out"
            onPress={handleSignOut}
            labelStyle={{ color: 'red' }}
          />
        </>
      )}
    </DrawerContentScrollView>
  )
}

const MyDrawer = () => {
  const { user } = useContext(UserContext)
  let count = 0
  if (user) count = user.pendingFriendRequests.filter(request => request.receiver === user._id).length

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name='Home'
        component={MyTabs}
        options={{
          headerTitle: user && user.username ? user.username : 'Home',
          headerStyle: {
            backgroundColor: '#007BFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => <CustomHeader user={user} />,
          drawerIcon: ({ size }) => (
            <Image
              source={user && user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture}
              style={{ width: size, height: size, borderRadius: size / 2 }}
            />
          ),
        }}
      />
      <Drawer.Screen name="Search for a User" component={SearchForUser} />
      <Drawer.Screen name={count ? `Friend requests +(${count})` : "Friend requests"} component={FriendRequests} />
    </Drawer.Navigator>
  )
}

export default MyDrawer
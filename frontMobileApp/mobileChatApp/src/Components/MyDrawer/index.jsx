import { useContext, useEffect } from 'react'
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

const Drawer = createDrawerNavigator()

const CustomHeader = ({ user }) => {
  const navigation = useNavigation()

  return (
    <Pressable onPress={() => navigation.toggleDrawer()}>
      <Image
        source={user && user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
    </Pressable>
  )
}

const CustomDrawerContent = (props) => {
  const { user, updateUser } = useContext(UserContext)
  const navigation = useNavigation()

  useEffect(() => {
    if (!user) navigation.navigate('Auth', { screen: 'NexusHive' })
  })


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

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name='Home'
        component={MyTabs}
        options={{
          headerLeft: () => <CustomHeader user={user} />,
          drawerIcon: ({ focused, size }) => (
            <Image
              source={user && user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture}
              style={{ width: size, height: size, borderRadius: size / 2 }}
            />
          ),
        }}
      />
      <Drawer.Screen name="Search For a User" component={SearchForUser} />
    </Drawer.Navigator>
  )
}

export default MyDrawer
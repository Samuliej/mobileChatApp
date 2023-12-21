import { useContext } from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { UserContext } from '../../Context/UserContext.js'
import { useNavigation } from '@react-navigation/native'
import { Image, Pressable, Alert, View, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon
import defaultProfilePicture from '../../../assets/soldier.png'
import MyTabs from '../MyTabs/index.jsx'
import SearchForUser from '../SearchForUser/index.jsx'
import Friends from '../Friends/index.jsx'
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

// Custom drawer item with badge
const CustomDrawerItem = ({ label, badgeCount, ...props }) => (
  <DrawerItem
    label={() => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>{label}</Text>
        {badgeCount > 0 && (
          <View style={{ backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
            <Text style={{ color: 'white' }}>{badgeCount}</Text>
          </View>
        )}
      </View>
    )}
    {...props}
  />
)

const MyDrawer = () => {
  const { user, updateUser } = useContext(UserContext)
  const pendingRequestsCount = user ? user.pendingFriendRequests.filter(request => request.status === 'PENDING').length : 0
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
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <View style={{ alignItems: 'center', margin: 10 }}>
            <Image
              source={user && user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
            <Text style={{ marginTop: 10 }}>{user ? user.username : 'Guest'}</Text>
          </View>
          <DrawerItem
            label="Home"
            onPress={() => props.navigation.navigate('Home')}
          />
          <DrawerItem
            label="Search for a User"
            onPress={() => props.navigation.navigate('Search for a User')}
          />
          <DrawerItem
            label="Friends"
            onPress={() => props.navigation.navigate('Friends')}
          />
          <CustomDrawerItem
            label="Friend requests"
            badgeCount={pendingRequestsCount}
            onPress={() => props.navigation.navigate('Friend requests')}
          />
          <DrawerItem
            label="Sign Out"
            onPress={handleSignOut}
            labelStyle={{ color: 'red' }}
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name='Home'
        component={MyTabs}
        options={{
          headerTitle: user ? user.username : 'Home',
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
      <Drawer.Screen name="Friends" component={Friends} />
      <Drawer.Screen name="Friend requests" component={FriendRequests} />
    </Drawer.Navigator>
  )
}

export default MyDrawer
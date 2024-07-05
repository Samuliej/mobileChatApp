import { useContext, useState, useEffect } from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem,  } from '@react-navigation/drawer'
import { UserContext } from '../../Context/UserContext.js'
import { useNavigation } from '@react-navigation/native'
import { Image, Pressable, Alert, View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { SocketContext } from '../../Context/SocketContext.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon
import defaultProfilePicture from '../../../assets/soldier.png'
import MyTabs from '../MyTabs/index.jsx'
import SearchForUser from '../SearchForUser/index.jsx'
import Friends from '../Friends/index.jsx'
import FriendRequests from '../FriendRequests/index.jsx'
import NewConversation from '../NewConversation/index.jsx'
import Chat from '../Chat/index.jsx'
import NewPost from '../Feed/NewPost/index.jsx'
import Friend from '../Friends/Friend/index.jsx'
import Profile from '../Profile/index.jsx'

/*

  Component for drawer navigation for the app.
  You press the user's profile picture to open the drawer and choose a component you want to enter
  or click out of the drawer to exit.

  The user can navigate to:
    * Home, which is the Tab navigator for switching between Chat and Feed.
    * Search for a User, component for searching for users to add friends
    * Friends, component for displaying all the user's friends
    * Friend requests, component for displaying all the user's pending friend requests
    * Sign Out, for signing out of the app.


*/

const Drawer = createDrawerNavigator()

const CustomHeader = ({ user }) => {
  const navigation = useNavigation()

  return (
    <Pressable onPress={() => navigation.toggleDrawer()}>
      <Image
        source={user && user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture}
        style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 8 }}
      />
    </Pressable>
  )
}

// Custom drawer item with badge for indicating pending friend requests in the drawer
const CustomDrawerItem = ({ label, badgeCount, ...props }) => (
  <DrawerItem
    label={() => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#696969', fontWeight: '500' }}>{label}</Text>
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
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
  const navigation = useNavigation()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const socket = useContext(SocketContext)

  useEffect(() => {
    setPendingRequestsCount(
      user
        ? user.pendingFriendRequests.filter(
          (request) =>
            request.status === 'PENDING' && request.sender !== user._id
        ).length
        : 0
    )
  }, [user])

  // Function for handling signing out
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
            setIsSigningOut(true)
            // Clear the token from the storage
            await AsyncStorage.removeItem('userToken')
            // Update the user context
            updateUser(null)
            socket.close()
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth', params: { screen: 'The Hive' } }],
            })
            // No need to set isSigning Out to false because the state will be reset
          }
        },
      ],
      {cancelable: false},
      //clicking outside of alert will not cancel
    )
  }

  if (isSigningOut) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <DrawerContentScrollView {...props}>
            <View style={{ alignItems: 'center', margin: 10, flex: 1 }}>
              <Pressable onPress={() => navigation.navigate('Profile')}>
                <Image
                  source={user && user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture}
                  style={{ width: 80, height: 80, borderRadius: 30 }}
                />
              </Pressable>
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
            <CustomDrawerItem
              label="Profile"
              onPress={() => props.navigation.navigate('Profile')}
            />
            <DrawerItem
              label="Sign Out"
              onPress={handleSignOut}
              labelStyle={{ color: 'red' }}
            />
          </DrawerContentScrollView>
          <View style={{ padding: 20, backgroundColor: '#D3D3D3', borderTopWidth: 1, borderTopColor: '#808080' }}>
            <Text style={{ textAlign: 'center', color: '#808080' }}>The Hive</Text>
          </View>
        </View>
      )}
    >
      <Drawer.Screen
        name='Home'
        component={MyTabs}
        options={{
          headerTitle: user ? user.username : 'Home',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#F5F5DC',
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
      <Drawer.Screen name="New conversation" component={NewConversation} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen name="NewPost" component={NewPost} />
      <Drawer.Screen name="Friend" component={Friend} />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default MyDrawer
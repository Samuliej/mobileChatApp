import { useContext, useState, useEffect } from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem,  } from '@react-navigation/drawer'
import { UserContext } from '../../Context/UserContext.js'
import { useNavigation } from '@react-navigation/native'
import { Image, Pressable, Alert, View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { SocketContext } from '../../Context/SocketContext.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQueryClient } from 'react-query'
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
import CustomHeader from './CustomHeader/index.jsx'
import CustomDrawerItem from './CustomDrawerItem/index.jsx'

const Drawer = createDrawerNavigator()

/**
 * MyDrawer is a React component that renders a custom navigation drawer using the DrawerNavigator from @react-navigation/drawer.
 * It integrates various screens and custom drawer items, including a sign-out functionality and displaying the user's profile picture.
 *
 * Contexts:
 * - UserContext: Provides access to the user's information.
 * - SocketContext: Provides access to the WebSocket connection.
 *
 * Hooks:
 * - useContext: To access UserContext and SocketContext.
 * - useState: To manage the state of pending friend requests count and sign-out process.
 * - useEffect: To update the pending friend requests count whenever the user's information changes.
 * - useNavigation: To navigate between screens.
 * - useQueryClient: From react-query, to manage query cache.
 *
 * Features:
 * - Displays the user's profile picture and username at the top of the drawer.
 * - Includes custom drawer items for navigation and functionality, such as signing out.
 * - Implements a sign-out process that clears user data and navigates to the authentication screen.
 * - Utilizes a loading indicator during the sign-out process.
 *
 * Props: None
 *
 * Returns:
 * - A Drawer.Navigator component with configured screens and a custom drawer content.
 */
const MyDrawer = () => {
  const { user, updateUser } = useContext(UserContext)
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
  const navigation = useNavigation()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const socket = useContext(SocketContext)
  const queryClient = useQueryClient()

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
            // Clear query client when signing out
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0].startsWith('conversations') })
            queryClient.clear()
            // Clear the token from the storage
            await AsyncStorage.removeItem('userToken')
            // Update the user context
            updateUser(null)
            socket.close()
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth', params: { screen: 'The Hive' } }],
            })
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
        <View style={styles.drawerContainer}>
          <DrawerContentScrollView {...props}>
            <View style={styles.profile}>
              <Pressable onPress={() => navigation.navigate('Profile')}>
                <Image
                  source={user && user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture}
                  style={styles.image}
                />
              </Pressable>
              <Text style={styles.username}>{user ? user.username : 'Guest'}</Text>
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
          <View style={styles.footer}>
            <Text style={styles.footerText}>The Hive</Text>
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
  drawerContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  profile: {
    alignItems: 'center',
    margin: 10,
    flex: 1
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  username: {
    marginTop: 10
  },
  footer: {
    padding: 20,
    backgroundColor: '#D3D3D3',
    borderTopWidth: 1,
    borderTopColor: '#808080'
  },
  footerText: {
    textAlign: 'center',
    color: '#808080'
  },

})


export default MyDrawer
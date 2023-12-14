import * as React from 'react'
import { useEffect } from 'react'
import SignIn from './src/Components/SignIn/index.jsx'
import SignUp from './src/Components/SignUp/index.jsx'
import { Image, Pressable, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { UserContext } from './src/Context/UserContext.js'
import { useContext } from 'react'
import FeedScreen from './src/Components/Feed/index.jsx'
import Conversations from './src/Components/Conversations/index.jsx'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from './src/theme.js'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SearchForUser from './src/Components/SearchForUser/index.jsx'
import { createStackNavigator } from '@react-navigation/stack'
import { UserProvider } from './src/Context/UserContext.js'
import defaultProfilePicture from './assets/soldier.png'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon




const AuthStack = createStackNavigator()
const RootStack = createStackNavigator()
const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()

const AuthFlow = () => (
  <AuthStack.Navigator initialRouteName="NexusHive">
    <AuthStack.Screen name="NexusHive" component={SignIn} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
    {/* Add this line below to get rid of error that no "Home screen" */}
  </AuthStack.Navigator>
)

const RootNavigator = () => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="Auth" component={AuthFlow} />
    <RootStack.Screen name="Main" component={MyDrawer} />
  </RootStack.Navigator>
)


function CustomHeader({ user }) {
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

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        activeTintColor: theme.platformStyle.color,
        inactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Conversations') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'
          } else if (route.name === 'Feed') {
            iconName = focused ? 'newspaper' : 'newspaper-outline'
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Conversations" component={Conversations} />
      <Tab.Screen name="Feed" component={FeedScreen} />
    </Tab.Navigator>
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
      //clicking out side of alert will not cancel
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

const App = () => {


  useEffect(() => {
    const clearStorage = async () => {
      await AsyncStorage.clear()
    }

    clearStorage()
  }, [])


  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  )
}

export default App
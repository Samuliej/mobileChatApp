import * as React from 'react'
import SignIn from './src/Components/SignIn/index.jsx'
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'
import { UserContext } from './src/Context/UserContext.js'
import { useContext } from 'react'
import FeedScreen from './src/Components/Feed/index.jsx'
import Conversations from './src/Components/Conversations/index.jsx'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import theme from './src/theme.js'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
const testImage = require('./assets/icon.png')







function CustomHeader({ user }) {
  const navigation = useNavigation()

  return (
    <Pressable onPress={() => navigation.toggleDrawer()}>
      <Image
        source={testImage}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
    </Pressable>
  )
}



const Tab = createBottomTabNavigator()

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
      tabBarOptions={{
        activeTintColor: theme.platformStyle.color,
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Conversations" component={Conversations} />
      <Tab.Screen name="Feed" component={FeedScreen} />
    </Tab.Navigator>
  )
}

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications Screen</Text>
    </View>
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
          text: 'Yes',
          onPress: async () => {
            // Clear the token from the storage
            await AsyncStorage.removeItem('userToken')
            // Update the user context
            await updateUser()
            navigation.navigate('Home')
          }
        },
        {
          text: 'No',
          onPress: () => console.log('No Pressed'), style: 'cancel'
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
        <DrawerItem
          label="Sign Out"
          onPress={handleSignOut}
          labelStyle={{ color: 'red' }}
        />
      )}
    </DrawerContentScrollView>
  )
}

const Drawer = createDrawerNavigator()

function MyDrawer() {
  const { user, updateUser } = useContext(UserContext)

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={MyTabs}
        options={{
          headerLeft: () => <CustomHeader user={user} />,
          drawerIcon: ({ focused, size }) => (
            <Image
              source={testImage}
              style={{ width: size, height: size, borderRadius: size / 2 }}
            />
          ),
        }}
      />
      {!user && <Drawer.Screen name="Sign In" component={SignIn} />}
    </Drawer.Navigator>
  )
}

const App = () => {
  const [user, setUser] = React.useState(null)

  const updateUser = (newUser) => {
    setUser(newUser)
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    </UserContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})

export default App
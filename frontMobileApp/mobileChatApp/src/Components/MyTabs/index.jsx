import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Conversations from '../Conversations/index.jsx'
import FeedScreen from '../Feed/index.jsx'
import theme from '../../theme.js'


const Tab = createMaterialTopTabNavigator()

/**
 * MyTabs is a React component that creates a material top tab navigator with two tabs: Conversations and Feed.
 * The top navigator bar is modified to move the navigation bar to the bottom of the screen.
 * It utilizes the `createMaterialTopTabNavigator` from `@react-navigation/material-top-tabs` for navigation and `Ionicons` for tab icons.
 *
 * Tabs:
 * - Conversations: Displays the Conversations screen.
 * - Feed: Displays the Feed screen.
 *
 * Screen Options:
 * - tabBarPosition: Sets the tab bar at the bottom of the screen.
 * - headerShown: Hides the header for the tab screens.
 * - tabBarIcon: Customizes the tab icons based on the route and focus state.
 * - tabBarActiveTintColor: Sets the color of the tab icon when it is active, using a color from the theme.
 * - tabBarInactiveTintColor: Sets the color of the tab icon when it is inactive to gray.
 * - tabBarIndicatorStyle: Customizes the indicator's style to match the theme color.
 *
 * Props: None
 *
 * Returns:
 * - A Tab.Navigator component with two Tab.Screen components for Conversations and Feed.
 */
const MyTabs = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        headerShown: false,
        inactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          size = 20
          if (route.name === 'Conversations') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'
          } else if (route.name === 'Feed') {
            iconName = focused ? 'newspaper' : 'newspaper-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: theme.platformStyle.color,
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: { backgroundColor: theme.platformStyle.color },
      })}
    >
      <Tab.Screen name="Conversations" component={Conversations} />
      <Tab.Screen name="Feed" component={FeedScreen} />
    </Tab.Navigator>
  )
}

export default MyTabs
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Conversations from '../Conversations/index.jsx'
import FeedScreen from '../Feed/index.jsx'
import theme from '../../theme.js'

/*

  Navigator for switching between the two main components Conversations and Feed

*/

const Tab = createMaterialTopTabNavigator()

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
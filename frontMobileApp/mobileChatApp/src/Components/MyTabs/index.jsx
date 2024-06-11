import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import theme from '../../theme.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Conversations from '../Conversations/index.jsx'
import FeedScreen from '../Feed/index.jsx'

/*

  Navigator for switching between the two main components Conversations and Feed

*/

const Tab = createBottomTabNavigator()

const MyTabs = () => {
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

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Conversations" component={Conversations} />
      <Tab.Screen name="Feed" component={FeedScreen} />
    </Tab.Navigator>
  )
}

export default MyTabs
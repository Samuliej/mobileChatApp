import AuthFlow from '../AuthFlow'
import { createStackNavigator } from '@react-navigation/stack'
import MyDrawer from '../MyDrawer'

const RootStack = createStackNavigator()

const RootNavigator = () => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="Auth" component={AuthFlow} />
    <RootStack.Screen name="Main" component={MyDrawer} />
  </RootStack.Navigator>
)

export default RootNavigator
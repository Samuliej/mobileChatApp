import { createStackNavigator } from '@react-navigation/stack'
import SignIn from '../SignIn/index.jsx'
import SignUp from '../SignUp/index.jsx'

const AuthStack = createStackNavigator()

const AuthFlow = () => (
  <AuthStack.Navigator initialRouteName="NexusHive">
    <AuthStack.Screen name="NexusHive" component={SignIn} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
    {/* Add this line below to get rid of error that no "Home screen" */}
  </AuthStack.Navigator>
)

export default AuthFlow
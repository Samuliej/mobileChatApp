import { createStackNavigator } from '@react-navigation/stack'
import SignIn from '../SignIn/index.jsx'
import SignUp from '../SignUp/index.jsx'

const AuthStack = createStackNavigator()

const AuthFlow = () => (
  <AuthStack.Navigator initialRouteName="NexusHive">
    <AuthStack.Screen
      name="NexusHive"
      component={SignIn}
      options={{ title: 'Welcome to NexusHive' }}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUp}
      options={{
        title: 'Create your account'
      }}
    />
  </AuthStack.Navigator>
)

export default AuthFlow
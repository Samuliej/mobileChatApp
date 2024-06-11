import { createStackNavigator } from '@react-navigation/stack'
import SignIn from '../SignIn/index.jsx'
import SignUp from '../SignUp/index.jsx'

/*

This component sets up the authentication flow of the application.
If you are registered, you can sign in, otherwise, you can register.

*/

const AuthStack = createStackNavigator()

const AuthFlow = () => (
  <AuthStack.Navigator initialRouteName="The Hive">
    <AuthStack.Screen
      name="The Hive"
      component={SignIn}
      options={{ title: 'Welcome to The Hive' }}
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
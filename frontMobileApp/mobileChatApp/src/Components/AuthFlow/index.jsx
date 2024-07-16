import { createStackNavigator } from '@react-navigation/stack'
import SignIn from '../SignIn/index.jsx'
import SignUp from '../SignUp/index.jsx'

const AuthStack = createStackNavigator()

/**
 * AuthFlow is a React component that sets up the authentication flow using a stack navigator from React Navigation.
 * It defines the navigation stack for the authentication screens, including sign-in and sign-up screens.
 *
 * The stack navigator is configured with two screens:
 * 1. "The Hive" - The sign-in screen, set as the initial route.
 * 2. "SignUp" - The sign-up screen for creating a new account.
 *
 * Each screen is configured with navigation options such as the title displayed in the header.
 *
 * Returns:
 * - A stack navigator component with the SignIn and SignUp screens configured.
 */
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
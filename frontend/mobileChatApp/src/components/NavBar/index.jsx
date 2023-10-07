import { View, ScrollView, StyleSheet } from 'react-native'
import theme from '../../theme';
import NavBarTab from './NavBarTab';
import { useNavigate } from 'react-router-native'
import { useAuthStorage } from '../../hooks/useAuthStorage';
import { useApolloClient } from '@apollo/client';
import useGetCurrentUser from '../../hooks/useGetCurrentUser';

const styles = StyleSheet.create({
  container: theme.container
});

const NavBar = () => {
  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient()
  let user = null
  const navigate = useNavigate()
  const data = useGetCurrentUser()
  user = data && data.user

  const handleSignOut = async () => {
    try {
      await authStorage.removeAccessToken()
      apolloClient.resetStore()
      navigate('/sign-in')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        {!user && (
          <>
            <NavBarTab text='Sign in' onPress={() => navigate('/sign-in')} />
            <NavBarTab text='Sign up' onPress={() => console.log('sign up')} />
          </>
        )}
        {user && (
          <NavBarTab text='Sign out' onPress={handleSignOut} />
        )}

      </ScrollView>
    </View>
  );
};

export default NavBar;
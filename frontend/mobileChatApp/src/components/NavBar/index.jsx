import { View, ScrollView, StyleSheet } from 'react-native'
import theme from '../../theme';
import NavBarTab from './NavBarTab';
import { useNavigate } from 'react-router-native'

const styles = StyleSheet.create({
  container: theme.container
});

const NavBar = () => {

  const navigate = useNavigate()

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <NavBarTab text='Sign in' onPress={() => navigate('/sign-in')} />
        <NavBarTab text='Sign up' onPress={() => console.log('sign up')} />
      </ScrollView>
    </View>
  );
};

export default NavBar;
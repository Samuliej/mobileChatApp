import { ScrollView, StyleSheet, View } from "react-native"
import { useNavigate } from "react-router-native"
import NavBarTab from "../NavBar/NavBarTab"
import useGetCurrentUser from "../../hooks/useGetCurrentUser";

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#363640',
    paddingBottom: 16,
    paddingLeft: 16,
    flexDirection: 'row',
    bottom: 0, // Position the bottom navigation bar at the bottom
  },
  scrollViewContent: {
    flexGrow: 1
  }
});

const BottomNav = () => {
  let user = null
  const navigate = useNavigate()
  const data = useGetCurrentUser(false)
  user = data && data.user

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollViewContent}>
        <>
          {user &&(
            <>
              <NavBarTab text='Contacts' onPress={() => navigate('/contacts')} />
              <NavBarTab text='Feed' onPress={() => navigate('/feed')} />
            </>
          )}
          {!user && (
            <NavBarTab text='' onPress={() => console.log('placeholder')} />
          )}
        </>
      </ScrollView>
    </View>
  )
}

export default BottomNav
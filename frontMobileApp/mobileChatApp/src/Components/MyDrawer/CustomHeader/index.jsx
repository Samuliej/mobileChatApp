import { useNavigation } from '@react-navigation/native'
import { Pressable, Image } from 'react-native'
import defaultProfilePicture from '../../../../assets/soldier.png'

// Custom header component for displaying the user profile picture
const CustomHeader = ({ user }) => {
  const navigation = useNavigation()

  return (
    <Pressable onPress={() => navigation.toggleDrawer()}>
      <Image
        source={user && user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture}
        style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 8 }}
      />
    </Pressable>
  )
}

export default CustomHeader
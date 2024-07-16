import { useNavigation } from '@react-navigation/native'
import { Pressable, Image } from 'react-native'
import defaultProfilePicture from '../../../../assets/soldier.png'

/**
 * CustomHeader is a React component that renders a pressable image in the header.
 * When pressed, it toggles the navigation drawer.
 *
 * Props:
 * - user: Object. The user object which may contain a profilePicture property.
 *
 * Behavior:
 * - If the user object has a profilePicture property, it displays that image.
 * - If not, it displays a default profile picture.
 * - Pressing the image toggles the navigation drawer.
 *
 * Returns:
 * - A Pressable component containing an Image. The source of the image is either the user's profile picture or a default image.
 */
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
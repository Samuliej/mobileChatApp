import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ErrorBanner from '../../Error/index'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon
import defaultProfilePicture from '../../../../assets/soldier.png'
import FriendPost from '../../Friends/Friend/FriendPost'
import ContentButtons from '../ContentButtons/index'
import InfoView from '../InfoView/index'
import EditView from '../EditView/index'
import theme from '../../../theme'

/**
 * ProfileContainer is a React component that renders the profile view of a user, including the user's information, posts, and options to edit the profile.
 *
 * Props:
 * - notif: Notification message to display, if any.
 * - toggleEditMode: Function to toggle the edit mode on and off.
 * - editMode: Boolean indicating whether the profile is in edit mode.
 * - selectImage: Function to trigger when the profile image is pressed in edit mode for selecting a new image.
 * - image: The current profile image URI. If not provided, a default image is used.
 * - user: Object containing user information (username, profilePicture).
 * - name, setName, phone, setPhone, city, setCity: State and setters for user's name, phone, and city.
 * - handleSave: Function to call when saving changes made in edit mode.
 * - currentView: String indicating the current view ('info' or 'posts').
 * - setCurrentView: Function to change the current view.
 * - userPosts: Array of user's posts.
 * - likePost, commentPost: Functions to like and comment on posts, respectively.
 *
 * Behavior:
 * - Displays a notification banner if `notif` is provided.
 * - Shows the user's profile picture, which can be tapped to change in edit mode.
 * - Renders a title with the user's username.
 * - In edit mode, displays an `EditView` for editing user information.
 * - Otherwise, shows `ContentButtons` to toggle between 'info' and 'posts' views, and displays the corresponding view.
 * - In 'posts' view, renders a list of `FriendPost` components for each post.
 */
const ProfileContainer = ({ notif, toggleEditMode, editMode, selectImage,
  image, user, name, setName, phone, setPhone, city, setCity, handleSave, currentView,
  setCurrentView, userPosts, likePost, commentPost  }) => {

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View>
        {notif && (
          <ErrorBanner error={notif} type={'success'} />
        )}
        <View style={{ alignItems: 'center' }}>
          <Pressable style={styles.editIcon} onPress={toggleEditMode}>
            <Ionicons name="settings-outline" size={30} color="#000" />
          </Pressable>
          {editMode ? (
            <Pressable style={styles.imageContainer} onPress={selectImage}>
              <Image source={image ? { uri: image } : defaultProfilePicture} style={styles.image} />
              <View style={styles.iconContainer}>
                <Ionicons name="create-outline" size={24} color="white" />
              </View>
            </Pressable>
          ) : (
            <View style={styles.imageContainer}>
              <Image source={user.profilePicture ? { uri: user.profilePicture } : defaultProfilePicture} style={styles.image} />
            </View>
          )}
        </View>

        <View>
          <Text style={styles.title}>{user.username}</Text>
          {editMode && (
            <EditView
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              city={city}
              setCity={setCity}
              handleSave={handleSave}
            />
          )}
          {!editMode && (<ContentButtons currentView={currentView} setCurrentView={setCurrentView}/>)}
          {(currentView === 'info' && !editMode) &&(<InfoView user={user} />)}
        </View>
        <View>
          {(currentView === 'posts' && !editMode) && userPosts.map(post =>
            <FriendPost key={post._id} post={post} likePost={likePost} commentPost={commentPost} />
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    ...theme.shadow
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center'
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 15,
  },
})

export default ProfileContainer
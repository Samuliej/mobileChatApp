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
 * Renders the profile container with various user details and functionalities based on the edit mode and current view.
 *
 * @param {Boolean} notif - Flag indicating if there is a notification to display
 * @param {Function} toggleEditMode - Function to toggle the edit mode
 * @param {Boolean} editMode - Flag indicating if the profile is in edit mode
 * @param {Function} selectImage - Function to select an image
 * @param {String} image - The image URL
 * @param {Object} user - User object containing user details
 * @param {String} name - User's name
 * @param {Function} setName - Function to set the user's name
 * @param {String} phone - User's phone number
 * @param {Function} setPhone - Function to set the user's phone number
 * @param {String} city - User's city
 * @param {Function} setCity - Function to set the user's city
 * @param {Function} handleSave - Function to handle saving changes
 * @param {String} currentView - The current view mode
 * @param {Function} setCurrentView - Function to set the current view
 * @param {Array} userPosts - Array of user posts
 * @param {Function} likePost - Function to like a post
 * @param {Function} commentPost - Function to comment on a post
 * @return {JSX.Element} The profile container component
 *
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
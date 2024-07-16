import { View, Pressable, Text, StyleSheet } from 'react-native'

/**
 * ContentButtons is a React component that renders two pressable buttons for toggling between user information and posts views.
 *
 * Props:
 * - currentView: A string indicating the current view ('info' or 'posts').
 * - setCurrentView: A function to update the current view state.
 *
 * Behavior:
 * - Renders two buttons: "User Info" and "Posts".
 * - The background color of each button changes based on the current view to indicate which view is active.
 * - Pressing a button updates the current view to the corresponding view ('info' or 'posts').
 *
 */
const ContentButtons = ({ currentView, setCurrentView }) => {

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
      <Pressable
        onPress={() => setCurrentView('info')}
        style={{
          backgroundColor: currentView === 'info' ? '#4CAF50' : '#f8f9fa',
          ...styles.contentButton
        }}
      >
        <Text style={{ color: currentView === 'info' ? '#ffffff' : '#000000' }}>User Info</Text>
      </Pressable>
      <Pressable
        onPress={() => setCurrentView('posts')}
        style={{
          backgroundColor: currentView === 'posts' ? '#4CAF50' : '#f8f9fa',
          ...styles.contentButton
        }}
      >
        <Text style={{ color: currentView === 'posts' ? '#ffffff' : '#000000' }}>Posts</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  contentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
})

export default ContentButtons
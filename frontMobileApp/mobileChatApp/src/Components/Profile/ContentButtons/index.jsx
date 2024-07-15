import { View, Pressable, Text, StyleSheet } from 'react-native'

/**
 * Renders two pressable buttons that toggle between displaying user info and posts.
 *
 * @param {Object} props - The properties for the component.
 * @param {string} props.currentView - The current view being displayed.
 * @param {Function} props.setCurrentView - The function to set the current view.
 * @return {JSX.Element} The rendered component.
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
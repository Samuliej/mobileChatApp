import React from 'react'
import { Text, Image, Pressable, Animated, StyleSheet } from 'react-native'
const defaultProfilePicture = require('../../../assets/soldier.png')

/*
  Component for displaying a single friend container inside Friends list
*/

const FriendItem = ({ friend, navigation }) => {
  const animateScale = new Animated.Value(1)

  const startAnimation = () => {
    Animated.spring(animateScale, {
      toValue: 1.1,
      friction: 2,
      useNativeDriver: true,
    }).start()
  }

  const resetAnimation = () => {
    Animated.spring(animateScale, {
      toValue: 1,
      friction: 2,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Animated.View
      style={[
        styles.friendItem,
        {
          transform: [{ scale: animateScale }],
        },
      ]}
    >
      <Pressable
        onPress={() => navigation.navigate('Friend', { friendId: friend._id })}
        onPressIn={startAnimation}
        onPressOut={resetAnimation}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Image source={friend.profilePicture ? { uri: friend.profilePicture } : defaultProfilePicture} style={styles.profileImage} />
        <Text style={styles.username}>{friend.username}</Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  username: {
    flex: 1,
    fontSize: 18,
  },
})

export default FriendItem
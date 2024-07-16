import React, { useRef } from 'react'
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native'


/**
 * CustomButton is a React component that renders an animated button.
 * The button scales down when pressed and scales back to its original size after release.
 *
 * Props:
 * - onPress: Function to be called when the button is pressed.
 * - title: Text to be displayed inside the button.
 * - style: Additional styling to be applied to the button.
 *
 * Animation:
 * - Uses a scale animation that changes the button's scale to 0.9 on press and returns it to 1 after release.
 *
 * Returns:
 * - A TouchableOpacity component that wraps an Animated.View, which contains a Text component displaying the button's title.
 *
 */
const CustomButton = ({ onPress, title, style }) => {
  const scaleValue = useRef(new Animated.Value(1)).current

  const animateScale = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  return (
    <TouchableOpacity onPress={() => { animateScale(); onPress() }}>
      <Animated.View style={[styles.button, style, { transform: [{ scale: scaleValue }] }]}>
        <Text style={styles.buttonText}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
})

export default CustomButton
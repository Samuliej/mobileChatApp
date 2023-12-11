import React, { useRef } from 'react'
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native'

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
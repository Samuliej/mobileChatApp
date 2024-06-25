import React from 'react'
import { View, Text } from 'react-native'
import { useRoute } from '@react-navigation/native'

const Friend = () => {
  const route = useRoute()
  const { friendId } = route.params


  return (
    <View>
      <Text>{friendId}</Text>
    </View>
  )
}

export default Friend
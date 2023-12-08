import { StatusBar } from 'expo-status-bar'
import { View, StyleSheet } from 'react-native'
import Main from './src/Components/Main.jsx'
import { NativeRouter } from 'react-router-native'

const App = () => {
  return (
    <View style={styles.container}>
      <NativeRouter>
        <Main />
      </NativeRouter>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default App
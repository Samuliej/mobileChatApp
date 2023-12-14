import React, { useState } from 'react'
import { View, TextInput, Text, FlatList, StyleSheet, Image } from 'react-native'
import { useSearchUser } from '../../hooks/useSearchUser'
import theme from '../../theme.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import defaultProfilePicture from '../../../assets/soldier.png'
// Default user profile picture property of Pixel Perfect:
// href="https://www.flaticon.com/free-icons/soldier" title="soldier icons">Soldier icons created by Pixel perfect - Flaticon

const SearchForUser = () => {
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const { searchResults } = useSearchUser(searchInput)

  const loadMoreResults = () => {
    setPage(page + 1)
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={searchInput}
        style={theme.inputBox}
        onChangeText={setSearchInput}
        placeholder="Search for a user"
      />
      {searchInput && (
        <FlatList
          onEndReached={loadMoreResults}
          //onEndReachedThreshold={0.5}
          data={searchResults}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Image
                source={item.profilePicture ? { uri: item.profilePicture } : defaultProfilePicture}
                style={styles.listingProfilePicture} // Add a style for the image
              />
              <Text style={styles.listItemText}> {item.username}</Text>
              <Icon.Button
                name="user-plus"
                backgroundColor="transparent"
                color="blue"
                onPress={() => {/* Handle friend request */}}
              />
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 16,
  },
  listingProfilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
  },
})


export default SearchForUser
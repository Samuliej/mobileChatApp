import React, { useContext, useState } from 'react'
import { View, Text, Image, TextInput, StyleSheet, Pressable } from 'react-native'
import { UserContext } from '../../Context/UserContext'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../SignIn/CustomButton'

const Profile = () => {
  const { user } = useContext(UserContext)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [city, setCity] = useState(user.city)

  const handleSave = () => {
    console.log('modified')
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.editIcon} onPress={() => setEditMode(!editMode)}>
        <Ionicons name="settings-outline" size={30} color="#000" />
      </Pressable>
      <View style={styles.imageContainer}>
        <Image source={{ uri: user.profilePicture }} style={styles.image} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{user.username}</Text>
        {editMode ? (
          <View>
            <Text>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
            <Text>Phone</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" />
            <Text>City</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />
            <CustomButton style={{ marginTop: 10, marginBottom: 20 }} onPress={handleSave} title='Save' />
          </View>
        ) : (
          <>
            <Text style={styles.infoText}>Username: {user.username}</Text>
            <Text style={styles.infoText}>Name: {name}</Text>
            <Text style={styles.infoText}>Phone: {phone}</Text>
            <Text style={styles.infoText}>City: {city}</Text>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e4e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center'
  },
  infoText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    fontSize: 18,
    marginBottom: 12,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
})

export default Profile
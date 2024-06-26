import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../Context/UserContext'
import { SocketContext } from '../Context/SocketContext'
import api from '../api'

const useFriends = () => {
  const { user } = useContext(UserContext)
  const socket = useContext(SocketContext)
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        const fetchedFriends = await Promise.all(user.friends.map(async (friendId) => {
          const response = await api.get(`/api/users/id/${friendId}`)
          const friendUser = await response.data
          return friendUser
        }))

        setFriends(fetchedFriends)
      }
      setLoading(false)
    }

    fetchFriends()

    // Listen for the 'friendRequestAccepted' event
    socket.on('friendRequestAccepted', async (friendship) => {
      // Check if the current user is involved in the friendship
      if (friendship.user1._id === user._id || friendship.user2._id === user._id) {
        // Get the new friend's user object
        const newFriendId = friendship.user1._id === user._id ? friendship.user2._id : friendship.user1._id
        const response = await api.get(`/api/users/id/${newFriendId}`)
        const newFriend = await response.data

        // Update the friends state to include the new friend
        setFriends(prevFriends => [...prevFriends, newFriend])
      }
    })

    return () => {
      socket.off('friendRequestAccepted')
    }
  }, [user ? user.friends : null, socket])

  return { friends, loading }
}

export default useFriends
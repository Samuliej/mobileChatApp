const express = require('express')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const mongoose = require('mongoose')
const cors = require('cors')
const websocketHandler = require('./routes/websockethandler')
const socketIo = require('socket.io')
const User = require('./models/User')
const Friendship = require('./models/Friendship')
const jwt = require('jsonwebtoken')

const getRoutes = require('./routes/get')
const postRoutes = require('./routes/post')
const putRoutes = require('./routes/put')
const deleteRoutes = require('./routes/delete')


let MONGODB_URI
if (process.env.NODE_ENV !== 'test') {
  MONGODB_URI = config.MONGODB_URI
} else {
  MONGODB_URI = config.MONGODB_TEST_URI
}

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    console.log(MONGODB_URI)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error)
  })

const app = express()
const server = require('http').createServer(app)
const io = socketIo(server)
app.use(bodyParser.json())

// initialize the routes
app.use(cors())
app.use(getRoutes)
app.use(postRoutes)
app.use(putRoutes)
app.use(deleteRoutes)

const port = config.PORT || 3000
const wsPort = config.WS_PORT || 3002
//const wsIoPort = config.WS_IO_PORT || 3001

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    return decoded
  } catch (err) {
    console.log('Token validation failed:', err)
    return null
  }
}

const userSocketIds = {}

io.on('connection', async (socket) => {
  console.log('a user connected')

  const userId = socket.handshake.query.userId
  userSocketIds[userId] = socket.id

  socket.on('sendFriendRequest', async (data) => {
    try {
      const friendUsername = data.username
      const token = data.token

      const currentUser = validateToken(token)

      console.log('currentUser:', currentUser)

      if (!currentUser) {
        console.log('Authentication required')
        socket.emit('error', 'Authentication required')
        return
      }

      const user = await User.findOne({ _id: currentUser.id })

      const receiver = await User.findOne({ username: friendUsername })
      console.log('sending friend request to:', receiver.username)

      console.log(data)

      let existingFriendship = await Friendship.findOne({
        $or: [
          { sender: currentUser._id, receiver: receiver._id },
          { sender: receiver._id, receiver: currentUser._id }
        ]
      })

      console.log(existingFriendship)

      if (existingFriendship && existingFriendship.status === 'PENDING') {
        socket.emit('error', { error: 'Friend request already sent' })
        return
      }

      if (existingFriendship && existingFriendship.status === 'DECLINED') {
        existingFriendship.status = 'PENDING'
        await existingFriendship.save()
        socket.emit('friendRequestUpdated', existingFriendship)
      } else {
        const newFriendship = new Friendship({
          sender: user._id,
          receiver: receiver._id,
          status: 'PENDING',
        })

        await newFriendship.save()

        user.pendingFriendRequests.push(newFriendship._id)
        await user.save()

        receiver.pendingFriendRequests.push(newFriendship._id)
        await receiver.save()

        socket.emit('friendRequestSent', newFriendship)

        const newFriendshipToFront = {...newFriendship, userObj: user}

        const receiverSocketId = userSocketIds[receiver._id]
        io.to(receiverSocketId).emit('friendRequest', newFriendshipToFront)
      }

    } catch (error) {
      console.log('Error sending friend request:', error)
      socket.emit('error', { error: 'Error sending friend request' })
    }
  })

  socket.on('acceptFriendRequest', async (data) => {
    try {
      const { friendshipId, token } = data

      const currentUser = validateToken(token)

      console.log('Accepting friend request:', data)

      if(!currentUser) {
        console.log('Authentication required')
        socket.emit('error', { error: 'Authentication required' })
        return
      }

      const friendship = await Friendship.findById(friendshipId)
      if(!friendship || friendship.status !== 'PENDING') {
        console.log('Invalid friend request')
        socket.emit('error', { error: 'Invalid friend request' })
        return
      }

      friendship.status = 'ACCEPTED'
      await friendship.save()

      const user = await User.findById(currentUser.id)
      user.friends.push(friendship.sender)
      await user.save()

      const friend = await User.findById(friendship.sender)
      friend.friends.push(user._id)
      await friend.save()

      console.log('userSocketids accepting request', userSocketIds)
      io.to(userSocketIds[user._id]).emit('friendRequestAccepted', friendship)
      io.to(userSocketIds[friend._id]).emit('friendRequestAccepted', friendship)

      socket.emit('friendRequestAccepted', friendship)
    } catch (error) {
      console.log('Error accepting friend request:', error)
      socket.emit('error', { error: 'Error accepting friend request' })
    }
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})
//websocketHandler(server, wsPort)

if (config.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

module.exports = app
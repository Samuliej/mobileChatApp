const express = require('express')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const mongoose = require('mongoose')
const cors = require('cors')
const Conversation = require('./models/Conversation')
const Message = require('./models/Message')
const socketIo = require('socket.io')
const User = require('./models/User')
const Friendship = require('./models/Friendship')
const jwt = require('jsonwebtoken')

const getRoutes = require('./routes/get')
const postRoutes = require('./routes/post')
const putRoutes = require('./routes/put')
const deleteRoutes = require('./routes/delete')


// Configure the correct Mongodb url
let MONGODB_URI
if (process.env.NODE_ENV !== 'test') {
  MONGODB_URI = config.MONGODB_URI
} else {
  MONGODB_URI = config.MONGODB_TEST_URI
}

console.log('connecting to MongoDB')

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
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

// Function for validating a json webtoken
const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    return decoded
  } catch (err) {
    console.log('Token validation failed:', err)
    return null
  }
}

// container for userId's and their corresponding sockets id's
const userSocketIds = {}

// handle websocket activity with socket.io
io.on('connection', async (socket) => {
  console.log('a user connected')
  const socketId = socket.id
  const userId = socket.handshake.query.userId
  // Store user id and the socket id as key-value pair
  userSocketIds[userId] = socketId

  // Handles sending friend requests
  socket.on('sendFriendRequest', async (data) => {
    try {
      const { username: friendUsername, token } = data
      const currentUser = validateToken(token)

      if (!currentUser) {
        console.log('Authentication required')
        socket.emit('error', 'Authentication required')
        return
      }

      const user = await User.findOne({ _id: currentUser.id })
      const receiver = await User.findOne({ username: friendUsername })

      let existingFriendship = await Friendship.findOne({
        $or: [
          { sender: currentUser._id, receiver: receiver._id },
          { sender: receiver._id, receiver: currentUser._id }
        ]
      })

      // If a friendship already exists, create an error
      if (existingFriendship && existingFriendship.status === 'PENDING') {
        socket.emit('error', { error: 'Friend request already sent' })
        return
      }

      // If an friendship is declined, change it back to pending
      // I'll later decide what to do with declined friendships
      if (existingFriendship && existingFriendship.status === 'DECLINED') {
        existingFriendship.status = 'PENDING'
        await existingFriendship.save()
        socket.emit('friendRequestUpdated', existingFriendship)
      }
      // Else create a new friendship
      else {
        const newFriendship = new Friendship({
          sender: user._id,
          receiver: receiver._id,
          status: 'PENDING',
        })

        await newFriendship.save()

        // Push the friendship to both of the user's pending requests
        user.pendingFriendRequests.push(newFriendship._id)
        await user.save()

        receiver.pendingFriendRequests.push(newFriendship._id)
        await receiver.save()

        // Emit the new friendship to catch on the frontend
        socket.emit('friendRequestSent', newFriendship)

        const newFriendshipToFront = { ...newFriendship._doc, userObj: user }

        const receiverSocketId = userSocketIds[receiver._id]

        io.sockets.sockets.get(receiverSocketId).emit('friendRequest', newFriendshipToFront, (error) => {
          if (error) {
            console.error('Error sending friend request:', error)
          } else {
            console.log('Friend request sent successfully')
          }
        })
      }
    } catch (error) {
      console.log('Error sending friend request:', error)
      socket.emit('error', { error: 'Error sending friend request' })
    }
  })


  // Handling accepting friend requests with socket
  socket.on('acceptFriendRequest', async (data) => {
    try {
      const { friendshipId, token } = data
      const currentUser = validateToken(token)

      if (!currentUser) {
        socket.emit('error', { error: 'Authentication required' })
        return
      }

      const friendship = await Friendship.findById(friendshipId)
      if (!friendship || friendship.status !== 'PENDING') {
        socket.emit('error', { error: 'Invalid friend request' })
        return
      }

      friendship.status = 'ACCEPTED'
      await friendship.save()

      // Update the user's and friend's friend list
      const user = await User.findById(currentUser.id)
      user.friends.push(friendship.sender)
      await user.save()

      const friend = await User.findById(friendship.sender)
      friend.friends.push(user._id)
      await friend.save()

      io.to(userSocketIds[user._id]).emit('friendRequestAccepted', friendship)
      io.to(userSocketIds[friend._id]).emit('friendRequestAccepted', friendship)

      socket.emit('friendRequestAccepted', friendship)
    } catch (error) {
      console.log('Error accepting friend request:', error)
      socket.emit('error', { error: 'Error accepting friend request' })
    }
  })


  // Handle messages with socket
  socket.on('message', async (message) => {
    const messageData = message
    const currentUser = validateToken(messageData.token)

    if (!currentUser) {
      console.log('Authentication required sending a message')
      socket.emit('error', { error: 'Authentication required' })
    }

    const conversation = await Conversation.findById(messageData.conversationId)
    // If no messages, it's a new conversation
    const isNewConvo = conversation.messages.length === 0

    if (!conversation) {
      console.log('conversation not found')
      socket.emit('error', { error: 'Conversation not found' })
    }

    let newMessage

    try {
      newMessage = new Message({
        sender: messageData.sender,
        receiver: messageData.receiver,
        content: messageData.content,
        timestamp: new Date().toISOString(),
        conversationId: conversation._id
      })

      await newMessage.save()

    } catch (error) {
      console.log('something went wrong creating new message')
      socket.emit('error', { error: 'Something went wrong creating new message' })
    }

    try {
      conversation.messages.push(newMessage._id)

      await conversation.save()
    } catch (error) {
      console.log('something went wrong updating the conversation')
      socket.emit('error', { error: 'Something went wrong updating the conversation'})
    }

    // Broadcast the messages to the sender and receiver
    io.to(userSocketIds[messageData.sender]).emit('message', newMessage)
    io.to(userSocketIds[messageData.receiver]).emit('message', newMessage)
    if (isNewConvo) {
      // If it's a new conversation, broadcast the conversation to the receiver
      io.to(userSocketIds[messageData.receiver]).emit('newConversation', conversation)
    }
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected')
    delete userSocketIds[userId]
  })
})

if (config.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

module.exports = app
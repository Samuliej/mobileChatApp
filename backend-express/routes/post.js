const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddlewares')

const User = require('../models/User')
const Friendship = require('../models/Friendship')
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')


// Create a user
router.post('/api/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      phone: req.body.phone,
      city: req.body.city,
      password: hashedPassword,
      pendingFriendRequests: [],
      friends: [],
    })

    const savedUser = await newUser.save()

    const userWithoutPassword = savedUser.toObject()
    delete userWithoutPassword.password

    res.status(201).json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong creating the user' })
  }
})

// User login
router.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })

    if (!user) {
      res.status(401).json({ error: 'User not found' })
      return
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password)

    if (!passwordMatch) {
      res.status(401).json({ error: 'Wrong credentials' })
      return
    }

    const userForToken = {
      username: user.username,
      id: user._id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // JWT expires in 1 hour
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET)
    res.json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong signing in' })
  }
})

// Send friend request
router.post('/api/sendFriendRequest', authMiddleware, async (req, res) => {
  try {
    const friendUsername = req.body.username
    const currentUser = req.currentUser
    const receiver = await User.findOne({ username: friendUsername })

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const existingFriendship = await Friendship.findOne({
      // Performs a logical OR operation on an array of two or
      // more expressions and selects the documents that satisfy at least one of the expressions.
      $or: [
        { sender: currentUser._id, receiver: receiver._id },
        { sender: receiver._id, receiver: currentUser._id }
      ]
    })

    if (existingFriendship) {
      return res.status(400).json({ error: 'Friend request already sent' })
    }

    const newFriendship = new Friendship({
      sender: currentUser._id,
      receiver: receiver._id,
      status: 'PENDING',
    })

    await newFriendship.save()

    currentUser.pendingFriendRequests.push(newFriendship._id)
    await currentUser.save()

    receiver.pendingFriendRequests.push(newFriendship._id)
    await receiver.save()

    res.status(201).json(newFriendship)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong saving new friendship state' })
  }
})

// Accept friend request
router.post('/api/acceptFriendRequest', async (req, res) => {
  const friendship = await Friendship.findOne({ _id: req.body.friendshipId })
  const currentUser = req.currentUser
  const requestSender = await User.findOne({ _id: friendship.sender })

  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  if (currentUser._id.toString() === friendship.receiver.toString()) {
    try {
      friendship.status = 'ACCEPTED'
      await friendship.save()
      currentUser.friends.push(friendship.sender)
      requestSender.friends.push(friendship.receiver)
      await currentUser.save()
      await requestSender.save()
      res.status(200).json(friendship)
    } catch (error) {
      res.status(500).json({ error: 'Error updating friendship status' })
    }
  } else {
    res.status(403).json({ error: 'Not authenticated to accept request' })
  }
})

// Send message
router.post('/api/sendMessage', authMiddleware, async (req, res) => {
  const currentUser = req.currentUser
  if (!currentUser) {
    return res.status(400).json({ error: 'Authentication required' })
  }

  const messageReceiver = await User.findOne({ username: req.body.username })
  if (!messageReceiver) {
    return res.status(400).json({ error: 'User not found' })
  }

  let conversation = await Conversation.findOne({
    participants: {
      $all: [currentUser._id, messageReceiver._id]
    }
  })

  if (!conversation) {
    conversation = new Conversation({
      participants: [currentUser._id, messageReceiver._id],
      messages: []
    })
  }

  if (currentUser.friends.includes(messageReceiver._id)) {
    const currentDate = new Date()
    const timestampString = currentDate.toISOString()

    const newMessage = new Message({
      content: req.body.content,
      sender: currentUser._id.toString(),
      receiver: messageReceiver._id.toString(),
      timestamp: timestampString
    })

    conversation.messages.push(newMessage._id)

    try {
      await newMessage.save()
      await conversation.save()
      return res.status(201).json(newMessage)
    } catch (error) {
      return res.status(500).json({ error: `Sending the message failed: ${error.message}` })
    }
  } else {
    return res.status(400).json({ error: 'Person is not currently on your friend list' })
  }
})

module.exports = router
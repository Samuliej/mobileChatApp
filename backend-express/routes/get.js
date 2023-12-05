const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Conversation = require('../models/Conversation')
const Friendship = require('../models/Friendship')

const authMiddleware = require('../middlewares/authMiddlewares')

// Fetch all users
router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' })
  }
})


// Fetch all conversations
router.get('/api/conversations', async (req, res) => {
  try {
    const convos = await Conversation.find({})
    res.json(convos)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversations' })
  }
})


// Fetch user by username
router.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' })
  }
})


// Fetch conversation by ID
router.get('/api/conversations/:convoId', async (req, res) => {
  try {
    const convo = await Conversation.findById(req.params.convoId)
    res.json(convo)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversation' })
  }
})

// Fetch current user
router.get('/api/me', authMiddleware, async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const userWithoutPassword = req.currentUser.toObject()
  delete userWithoutPassword.password

  res.json(userWithoutPassword)
})

// Fetch friend requests;
router.get('/api/friendRequests', authMiddleware, async (req, res) => {
  const currentUser = req.currentUser
  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  try {
    const friendRequests = await Friendship.find({
      receiver: currentUser._id,
      status: 'PENDING'
    }).populate('sender', 'username') // populate the sender field with the username of the sender

    res.json(friendRequests)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friend requests' })
  }
})

module.exports = router
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Conversation = require('../models/Conversation')
const Friendship = require('../models/Friendship')
const Message = require('../models/Message')

const authMiddleware = require('../middlewares/authMiddlewares')

// Fetch all users
router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
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
      .select('-password')
      .populate('friends', 'username')
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' })
  }
})

// Fetch user by id
router.get('/api/users/id/:userId', async (req, res) => {
  try {
    console.log(req.params.userId)
    const user = await User.findById(req.params.userId).select('-password')
      .populate('friends', 'username')
      .populate('profilePicture', 'url')
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' })
  }
})

// Check if a username is taken
router.get('/api/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    res.json({ isTaken: !!user })
  } catch (error) {
    res.status(500).json({ error: 'Error checking username' })
  }
})

// Fetch users by username query pagination added
router.get('/api/users/search/:query', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 5 // results / page
    const skip = (page - 1) * limit
    // Changed the regex to match usernames starting with the query
    const users = await User.find({ username: new RegExp('^' + req.params.query, 'i') }).select('-password')
      .populate('friends', 'username')
      .populate('pendingFriendRequests')
      .skip(skip)
      .limit(limit)

    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' })
  }
})


// Fetch conversation by ID
router.get('/api/conversations/:convoId', async (req, res) => {
  try {
    const convo = await Conversation.findById(req.params.convoId)
      .populate('participants')
      .populate({
        path: 'messages',
        populate: {
          path: 'sender receiver',
          model: 'User'
        }
      })
    res.json(convo)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversation' })
  }
})


// Fetch messages in a conversation
router.get('/api/conversations/:convoId/messages', async (req, res) => {
  try {
    const convo = await Conversation.findById(req.params.convoId)
      .populate({
        path: 'messages',
        populate: {
          path: 'sender receiver',
          model: 'User',
          select: '-password'
        }
      })
    res.json(convo.messages)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' })
  }
})


// Fetch current user
router.get('/api/me', authMiddleware, async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  // Populate the pendingFriendships field
  const user = await User.findById(req.currentUser._id)
    .select('-password')
    .populate('pendingFriendRequests')
    .populate('conversations')

  res.json(user)
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
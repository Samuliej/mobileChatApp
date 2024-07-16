const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const Friendship = require('../models/Friendship')
const authMiddleware = require('../middlewares/authMiddlewares')

/*

  routes for get operations.

*/

// Fetch all users
router.get('/api/users', authMiddleware, async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const users = await User.find({}).select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' })
  }
})


// Fetch all conversations
router.get('/api/conversations', authMiddleware, async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const convos = await Conversation.find({})
    res.json(convos)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversations' })
  }
})


// Fetch user by username
router.get('/api/users/:username', authMiddleware, async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

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
router.get('/api/users/id/:userId', authMiddleware, async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('profilePicture', 'url')
      .populate('posts', 'title')
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
router.get('/api/users/search/:query', authMiddleware, async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

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
router.get('/api/conversations/:convoId', authMiddleware, async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 15
    const skip = (page - 1) * limit

    const convo = await Conversation.findById(req.params.convoId)
      .populate('participants')
      .populate({
        path: 'messages',
        options: {
          skip: skip,
          limit: limit,
          sort: { timestamp: -1 }
        }
      })

    const totalMessages = await Message.countDocuments({ conversationId: convo._id })
    const itemsPerPage = limit
    const totalPages = Math.ceil(totalMessages / itemsPerPage)
    const currentPage = page

    // Check if there is a next page
    const hasNextPage = currentPage < totalPages

    res.json({
      conversation: convo,
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: hasNextPage,
      totalMessages: totalMessages
    })
  } catch (error) {
    console.log('error fetching conversation', error)
    res.status(500).json({ error: 'Error fetching conversation' })
  }
})


// Fetch messages in a conversation
router.get('/api/conversations/:convoId/messages', authMiddleware, async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

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

// Fetch friend requests
router.get('/api/friendRequests', authMiddleware, async (req, res) => {
  const currentUser = req.currentUser
  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  try {
    const friendRequests = await Friendship.find({
      receiver: currentUser._id,
      status: 'PENDING'
    }).populate('sender', 'username')

    res.json(friendRequests)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friend requests' })
  }
})


// Fetch user's posts
router.get('/api/posts/user/:userId', authMiddleware, async (req, res) => {
  const currentUser = req.currentUser
  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  const { userId } = req.params

  try {
    const user = await User.findById(userId).populate({
      path: 'posts',
      options: { sort: { 'createdAt': -1 } },
      populate: {
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username'
        }
      }
    })

    res.status(200).json(user.posts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching user posts' })
  }
})


// Fetch friends' posts
router.get('/api/posts/friends/:userId', authMiddleware, async (req, res) => {
  const currentUser = req.currentUser
  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  const { userId } = req.params

  try {
    const user = await User.findById(userId).populate({
      path: 'friends',
      populate: {
        path: 'posts',
        model: 'Post',
        options: { sort: { 'createdAt': -1 } },
        populate: {
          path: 'comments',
          model: 'Comment',
          populate: {
            path: 'user',
            model: 'User',
            select: 'username'
          }
        }
      }
    })

    const friendsPosts = await Promise.all(user.friends.flatMap(async friend => {
      return await Promise.all(friend.posts.map(async post => {
        const author = await User.findById(post.author)
        return {
          ...post._doc,
          author: {
            _id: author._id,
            username: author.username,
            profilePicture: author.profilePicture
          }
        }
      }))
    }))

    res.status(200).json(friendsPosts.flat())
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching friends posts' })
  }

})

router.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path)
  next()
})

module.exports = router
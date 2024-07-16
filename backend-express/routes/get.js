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

/**
 * GET /api/users - Fetches all users excluding passwords. Requires authentication.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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


/**
 * GET /api/conversations - Fetches all conversations. Requires authentication.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
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


/**
 * GET /api/users/:username - Fetches a user by username excluding their password and populates friends' usernames. Requires authentication.
 * @param {Object} req - Express request object, containing the username parameter.
 * @param {Object} res - Express response object used to send the response.
 */
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


/**
 * GET /api/users/id/:userId - Fetches a user by ID, excluding their password, and populates profile picture URL and post titles. Requires authentication.
 * @param {Object} req - Express request object, containing the userId parameter.
 * @param {Object} res - Express response object used to send the response.
 */
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


/**
 * GET /api/username/:username - Checks if a username is already taken.
 * @param {Object} req - Express request object, containing the username parameter.
 * @param {Object} res - Express response object used to send the response.
 */
router.get('/api/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    res.json({ isTaken: !!user })
  } catch (error) {
    res.status(500).json({ error: 'Error checking username' })
  }
})


/**
 * GET /api/users/search/:query - Fetches users by username with pagination. Requires authentication.
 * @param {Object} req - Express request object, containing the username query and pagination parameters.
 * @param {Object} res - Express response object used to send the response.
 */
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


/**
 * GET /api/conversations/:convoId - Fetches a single conversation by ID with pagination for messages.
 * Requires authentication. Returns conversation details, current page, total pages, if there's a next page, and total messages.
 * @param {Object} req - Express request object, containing conversation ID and pagination parameters.
 * @param {Object} res - Express response object used to send the response.
 */
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


/**
 * GET /api/conversations/:convoId/messages - Fetches all messages within a specific conversation.
 * Requires authentication. Populates sender and receiver details excluding passwords.
 * @param {Object} req - Express request object, containing the conversation ID.
 * @param {Object} res - Express response object used to send the response.
 */
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


/**
 * GET /api/me - Fetches the current authenticated user's details excluding their password.
 * Populates pending friend requests and conversations. Requires authentication.
 * @param {Object} req - Express request object, containing the current user's authentication information.
 * @param {Object} res - Express response object used to send the response.
 */
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


/**
 * GET /api/friendRequests - Fetches pending friend requests for the current user.
 * Requires authentication. Populates sender's username.
 * @param {Object} req - Express request object, containing the current user's authentication information.
 * @param {Object} res - Express response object used to send the response.
 */
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


/**
 * GET /api/posts/user/:userId - Fetches all posts made by a specific user.
 * Requires authentication. Sorts posts by creation date in descending order and populates comments with commenter's username.
 * @param {Object} req - Express request object, containing the userId parameter and the current user's authentication information.
 * @param {Object} res - Express response object used to send the response.
 */
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


/**
 * GET /api/posts/friends/:userId - Fetches posts made by friends of a specific user.
 * Requires authentication. Sorts posts by creation date in descending order, populates comments with commenter's username,
 * and enriches each post with the author's username and profile picture.
 * @param {Object} req - Express request object, containing the userId parameter and the current user's authentication information.
 * @param {Object} res - Express response object used to send the response.
 */
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
const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddlewares')

const User = require('../models/User')
const Friendship = require('../models/Friendship')
const Conversation = require('../models/Conversation')
const Post = require('../models/Post')
const Comment = require('../models/Comment')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const cloudinary = require('../cloudinary')

/*

  Routes for post operations

*/


// Create a user
router.post('/api/users', upload.single('profilePicture'), async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let result = null
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path)
    }

    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      profilePicture: result ? result.secure_url : null,
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
    console.error(error)
    res.status(500).json({ error: 'Something went wrong creating the user' })
  }
})

// User login
router.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
      .populate('pendingFriendRequests')
      .populate('friends')

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
    console.error(req.body)
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

    let existingFriendship = await Friendship.findOne({
      $or: [
        { sender: currentUser._id, receiver: receiver._id },
        { sender: receiver._id, receiver: currentUser._id }
      ]
    })

    if (existingFriendship && existingFriendship.status === 'PENDING') {
      return res.status(400).json({ error: 'Friend request already sent' })
    }

    if (existingFriendship && existingFriendship.status === 'DECLINED') {
      existingFriendship.status = 'PENDING'
      await existingFriendship.save()
      res.status(200).json(existingFriendship)
    } else {
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
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong saving new friendship state' })
  }
})

// Start a new conversation
router.post('/api/startConversation', authMiddleware, async (req, res) => {
  console.log('Starting conversation')
  const currentUser = req.currentUser
  let user = await User.findOne({ username: currentUser.username })
  if (!currentUser) {
    return res.status(400).json({ error: 'Authentication required' })
  }

  const friend = await User.findOne({ username: req.body.username })
  if (!friend) {
    return res.status(400).json({ error: 'User not found' })
  }

  let conversation = await Conversation.findOne({
    participants: {
      $all: [currentUser._id, friend._id]
    }
  })

  if (!conversation) {
    conversation = new Conversation({
      participants: [currentUser._id, friend._id],
      messages: []
    })
  }

  if (currentUser.friends.includes(friend._id)) {
    user.conversations.push(conversation._id)
    friend.conversations.push(conversation._id)

    try {
      await conversation.save()
      await user.save()
      await friend.save()
      return res.status(201).json({
        conversation: conversation
      })
    } catch (error) {
      return res.status(500).json({ error: `Starting the conversation failed: ${error.message}` })
    }
  } else {
    return res.status(400).json({ error: 'Person is not currently on your friend list' })
  }
})

// Mark message as read
router.post('/api/markAsRead', authMiddleware, async (req, res) => {
  const currentUser = req.currentUser
  const messageId = req.body.messageId
  const conversationId = req.body.conversationId

  if (!currentUser) {
    return res.status(400).json({ error: 'Authentication required' })
  }

  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    return res.status(400).json({ error: 'Conversation not found' })
  }

  if (conversation.participants.includes(currentUser._id)) {
    conversation.lastRead.set(currentUser._id.toString(), messageId)

    try {
      await conversation.save()
      return res.status(200).json({
        conversation: conversation
      })
    } catch (error) {
      return res.status(500).json({ error: `Marking the message as read failed: ${error.message}` })
    }
  } else {
    return res.status(400).json({ error: 'You are not a participant in this conversation' })
  }
})


// Update last read message
router.post('/api/updateLastRead', authMiddleware, async (req, res) => {
  const currentUser = req.currentUser
  const { conversationId, messageId } = req.body

  if (!currentUser) {
    return res.status(400).json({ error: 'Authentication required' })
  }

  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    return res.status(400).json({ error: 'Conversation not found' })
  }

  if (conversation.participants.includes(currentUser._id)) {
    conversation.lastRead.set(currentUser._id.toString(), messageId)

    try {
      await conversation.save()
      return res.status(200).json({
        conversation: conversation
      })
    } catch (error) {
      return res.status(500).json({ error: `Updating lastRead failed: ${error.message}` })
    }
  } else {
    return res.status(400).json({ error: 'You are not a participant in this conversation' })
  }
})

// Create a new post
router.post('/api/posts', authMiddleware, upload.single('image'), async (req, res) => {
  const content = req.body.content
  const author = req.body.author

  const currentUser = req.currentUser
  if (!currentUser) {
    return res.status(400).json({ error: 'Authentication required' })
  }

  console.log('reqfile', req.file)

  let result = null
  if (req.file) {
    result = await cloudinary.uploader.upload(req.file.path)
  }

  const newPost = new Post({
    content: {
      text: content,
      image: result ? result.secure_url : null
    },
    author: author,
    comments: [],
    likes: 0
  })

  try {
    const savedPost = await newPost.save()
    const user = await User.findById(author)
    user.posts.push(savedPost._id)
    await user.save()

    res.status(201).json(savedPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong creating the post' })
  }
})

// Comment a post
router.post('/api/posts/:postId/comments', authMiddleware, async (req, res) => {
  const { postId, content } = req.body

  const currentUser = req.currentUser
  if (!currentUser) {
    return res.status(400).json({ error: 'Authentication required' })
  }

  const newComment = new Comment({
    post: postId,
    user: currentUser._id,
    content: content
  })

  try {
    const savedComment = await newComment.save()
    const populatedComment = await Comment.findById(savedComment._id).populate('user', 'username')

    const post = await Post.findById(postId)
    post.comments.push(savedComment._id)
    await post.save()

    res.status(201).json(populatedComment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong creating the comment' })
  }
})

router.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path)
  next()
})

module.exports = router
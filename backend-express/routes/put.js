const express = require('express')
const router = express.Router()
const Friendship = require('../models/Friendship')
const User = require('../models/User')
const Post = require('../models/Post')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const cloudinary = require('../cloudinary')

const authMiddleware = require('../middlewares/authMiddlewares')

/*

  Routes for put operations

*/

// Decline friend request
router.put('/api/declineFriendRequest/:friendshipId', authMiddleware, async (req, res) => {
  const friendship = await Friendship.findOne({ _id: req.params.friendshipId })
  const currentUser = req.currentUser

  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  if (currentUser._id.toString() === friendship.receiver.toString()) {
    try {
      // Remove the friendship from the pendingFriendRequests array of the currentUser
      currentUser.pendingFriendRequests = currentUser.pendingFriendRequests.filter(request => request._id.toString() !== friendship._id.toString())
      await currentUser.save()

      // Delete the friendship
      await Friendship.deleteOne({ _id: req.params.friendshipId })

      res.status(200).json({ message: 'Friend request declined' })
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong declining the friendship' })
    }
  } else {
    res.status(403).json({ error: 'Not authenticated to decline request' })
  }
})

// Accept friend request
router.put('/api/acceptFriendRequest', authMiddleware, async (req, res) => {
  const friendship = await Friendship.findOne({ _id: req.body.friendshipId })
  const currentUser = req.currentUser
  let requestSender

  if (friendship)
    requestSender = await User.findOne({ _id: friendship.sender })
  else return res.status(404).json({ error: 'Friendship not found' })

  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  if (currentUser._id.toString() === friendship.receiver.toString()) {
    try {
      friendship.status = 'ACCEPTED'
      await friendship.save()

      currentUser.friends.push(friendship.sender)
      currentUser.pendingFriendRequests = currentUser.pendingFriendRequests.filter(request => request.toString() !== friendship._id.toString())
      await currentUser.save()

      requestSender.friends.push(friendship.receiver)
      requestSender.pendingFriendRequests = requestSender.pendingFriendRequests.filter(request => request.toString() !== friendship._id.toString())
      await requestSender.save()

      res.status(200).json(friendship)
    } catch (error) {
      res.status(500).json({ error: 'Error updating friendship status' })
    }
  } else {
    res.status(403).json({ error: 'Not authenticated to accept request' })
  }
})

// Like a post
router.put('/api/likePost/:postId/like', authMiddleware, async (req, res) => {
  const { postId } = req.params
  const currentUser = req.currentUser

  if (!currentUser) {
    return res.status(400).json({ error: 'Authentication required' })
  }

  try {
    const post = await Post.findById(postId)

    if (!post.likedBy.includes(currentUser._id)) {
      post.likes += 1
      post.likedBy.push(currentUser._id)
      await post.save()
      res.status(200).json(post)
    } else {
      res.status(400).json({ error: 'User has already liked this post' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error liking post' })
  }
})


// update user info
router.put('/api/users/:id', upload.single('profilePicture'), authMiddleware, async (req, res) => {
  const currentUser = req.currentUser
  const {name, phone, city} = req.body

  if (!currentUser) {
    return res.status(400).json({ error: 'Authentication required' })
  }

  try {
    let result = null
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path)
    }
    const userToModify = await User.findById(currentUser._id)
      .select('-password')
      .populate('pendingFriendRequests')
      .populate('conversations')
    if (name) userToModify.name = name
    if (phone) userToModify.phone = phone
    if (city) userToModify.city = city
    if (result) userToModify.profilePicture = result.secure_url


    await userToModify.save()
    res.status(200).json(userToModify)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error modifying User info' })
  }
})

router.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path)
  next()
})

module.exports = router
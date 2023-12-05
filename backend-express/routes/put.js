const express = require('express')
const router = express.Router()
const Friendship = require('../models/Friendship')

const authMiddleware = require('../middlewares/authMiddlewares')

// Decline friend request
router.put('/api/declineFriendRequest/:friendshipId', authMiddleware, async (req, res) => {
  const friendship = await Friendship.findOne({ _id: req.params.friendshipId })
  const currentUser = req.currentUser

  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  if (currentUser._id.toString() === friendship.receiver.toString()) {
    try {
      friendship.status = 'DECLINED'
      await friendship.save()
      res.status(200).json(friendship)
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong declining the friendship' })
    }
  } else {
    res.status(403).json({ error: 'Not authenticated to decline request' })
  }
})

module.exports = router
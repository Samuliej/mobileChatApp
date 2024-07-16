const express = require('express')
const router = express.Router()
const Conversation = require('../models/Conversation')
const authMiddleware = require('../middlewares/authMiddlewares')

/*

  routes for delete operations

*/


/**
 * Route handler for deleting a conversation by ID.
 * This endpoint allows for the deletion of a conversation from the database using its unique identifier.
 * It first attempts to find the conversation by ID. If found, it proceeds to delete the conversation.
 * Responds with a success message upon deletion or an error message if the conversation cannot be found or if an error occurs during deletion.
 *
 * @param {object} req - The request object, containing the parameters and any body data.
 * @param {object} res - The response object used to send back the desired HTTP response.
 * @async
 */
router.delete('/api/conversations/:id', authMiddleware, async (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const conversation = await Conversation.findById(req.params.id)

    console.log(conversation)

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    await Conversation.deleteOne({ _id: req.params.id })

    res.status(200).json({ message: 'Conversation deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting conversation' })
  }
})

router.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path)
  next()
})

module.exports = router
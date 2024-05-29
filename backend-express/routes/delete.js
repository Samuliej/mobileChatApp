const express = require('express')
const router = express.Router()
const Conversation = require('../models/Conversation')

// Delete a conversation
router.delete('/api/conversations/:id', async (req, res) => {
  console.log('deleting conversation')
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

module.exports = router
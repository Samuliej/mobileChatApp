const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddlewares')
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const WebSocket = require('ws')


module.exports = (app, wss) => {
  // Send message
  router.post('/api/sendMessage', authMiddleware, async (req, res) => {
    console.log('sending message')
    const currentUser = req.currentUser
    console.log(currentUser)
    if (!currentUser) {
      return res.status(400).json({ error: 'Authentication required' })
    }

    console.log('Authentication successful')

    const conversation = await Conversation.findById(req.body.conversationId)

    if (!conversation) {
      return res.status(400).json({ error: 'Conversation not found' })
    }

    console.log('Conversation found')

    if (conversation.participants.includes(currentUser._id)) {
      const currentDate = new Date()
      const timestampString = currentDate.toISOString()

      const newMessage = new Message({
        content: req.body.content,
        sender: currentUser._id.toString(),
        receiver: conversation.participants.find(participant => participant.toString() !== currentUser._id.toString()),
        timestamp: timestampString
      })

      conversation.messages.push(newMessage._id)

      try {
        await newMessage.save()
        await conversation.save()
        await conversation.populate([
          {
            path: 'messages',
            populate: {
              path: 'sender receiver',
              model: 'User',
              select: '-password'
            }
          },
          {
            path: 'lastRead',
            populate: {
              path: 'user message',
              model: 'User Message'
            }
          }
        ])

        // Broadcast new message to all connected clients
        const messageData = {
          conversation: conversation,
          message: newMessage
        }
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(messageData))
          }
        })

        return res.status(201).json(messageData)
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: `Sending the message failed: ${error.message}` })
      }
    } else {
      console.log('Not a participant')
      return res.status(400).json({ error: 'You are not a participant in this conversation' })
    }
  })

  return router
}
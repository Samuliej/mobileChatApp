const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const User = require('../models/User')
const Friendship = require('../models/Friendship')

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    return decoded
  } catch (err) {
    console.log('Token validation failed:', err)
    return null
  }
}

module.exports = (server, wsPort) => {
  const wss = new WebSocket.Server({ server })


  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      const messageData = JSON.parse(message)

      if (messageData.token) {
        ws.user = validateToken(messageData.token)
        ws.userId = ws.user.id
        if (!ws.user) {
          return ws.send(JSON.stringify({ error: 'Authentication required' }))
        }
      }


      if (messageData.type === 'OPEN_CONVERSATION') {
        console.log('Opening conversation')
        const conversation = await Conversation.findById(messageData.conversationId)
        if (!conversation) {
          return ws.send(JSON.stringify({ error: 'Conversation not found' }))
        }
        conversation.currentlyOpen = !conversation.currentlyOpen
        await conversation.save()
        return
      }

      if (messageData.type === 'CLOSE_CONVERSATION') {
        console.log('Closing conversation')
        const conversation = await Conversation.findById(messageData.conversationId)
        if (!conversation) {
          return ws.send(JSON.stringify({ error: 'Conversation not found' }))
        }
        conversation.currentlyOpen = !conversation.currentlyOpen
        await conversation.save()
        return
      }

      console.log('Token through validation')

      const conversation = await Conversation.findById(messageData.conversationId)
      if (!conversation) {
        return ws.send(JSON.stringify({ error: 'Conversation not found' }))
      }

      console.log('Conversation found')

      if (!conversation.participants.includes(ws.userId)) {
        return ws.send(JSON.stringify({ error: 'You are not a participant in this conversation' }))
      }

      console.log('User is a participant')

      const newMessage = new Message({
        content: messageData.content,
        sender: { _id: ws.userId.toString() },
        receiver: conversation.participants.find(participant => participant.toString() !== ws.userId.toString()),
        timestamp: new Date().toISOString()
      })

      try {
        // Find the user who is the receiver of the message
        const receivingUser = await User.findById(newMessage.receiver._id)

        const userConversation = receivingUser.conversations.find(convo => convo._id.toString() === newMessage.conversationId)

        if (userConversation) {
          // Increment the unreadCount
          userConversation.unreadCount++

          // Save the user document
          await receivingUser.save()
          // Send the updated unreadCount and conversationId to the client
          console.log('Sending update unread count')
          ws.send(JSON.stringify({
            type: 'UPDATE_UNREAD_COUNT',
            payload: {
              conversationId: newMessage.conversationId,
              unreadCount: userConversation.unreadCount
            }
          }))

        } else {
          // Handle the case where the conversation is not found in the user's conversations field
          console.error(`Conversation not found for user ${receivingUser._id}`)
          ws.send(JSON.stringify({ error: `Conversation not found for user ${receivingUser._id}` }))
        }
      } catch (error) {
        console.error(error)
        ws.send(JSON.stringify({ error: `Sending the message failed: ${error.message}` }))
      }

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
              select: '_id name username'
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

        const messageData = {
          conversationId: conversation._id,
          message: newMessage,
        }

        console.log(messageData)

        wss.clients.forEach((client) => {
          console.log('broadcasting message')
          console.log('client.readyState', client.readyState)
          if (client.readyState === WebSocket.OPEN) {
            console.log('sending message')
            console.log(JSON.stringify(messageData))
            client.send(JSON.stringify(messageData))
          }
        })
      } catch (error) {
        console.error(error)
        ws.send(JSON.stringify({ error: `Sending the message failed: ${error.message}` }))
      }

      // Broadcast the updated conversation to all connected clients
      wss.clients.forEach((client) => {
        console.log('broadcasting conversation')
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(conversation))
        }
      })
    })
  })

  server.listen(wsPort, () => {
    console.log(`WebSocket Server is running on port ${wsPort}`)
  })
}
const Conversation = require('./models/Conversation')
const Message = require('./models/Message')
const socketIo = require('socket.io')
const User = require('./models/User')
const Friendship = require('./models/Friendship')
const validateToken = require('./utils/validateToken')


/**
 * Initializes and configures the WebSocket server using socket.io.
 *
 * @param {Object} server - The HTTP server instance to attach the WebSocket server to.
 *
 * This function performs the following steps:
 * 1. Initializes a new socket.io instance attached to the provided server.
 * 2. Creates a container to map userIds to their corresponding socket IDs.
 * 3. Sets up an event listener for new WebSocket connections.
 *    a. Logs a message when a user connects.
 *    b. Retrieves the socket ID and the user ID from the handshake query.
 *    c. Stores the user ID and socket ID as a key-value pair in the container.
 */
module.exports = function (server) {
  const io = socketIo(server)
  // container for userId's and their corresponding sockets id's
  const userSocketIds = {}

  // handle websocket activity with socket.io
  io.on('connection', async (socket) => {
    console.log('a user connected')

    // Get the socket id and userId to store
    const socketId = socket.id
    const userId = socket.handshake.query.userId
    // Store user id and the socket id as key-value pair
    userSocketIds[userId] = socketId


    /**
     * Event listener for 'sendFriendRequest'. Handles the logic for sending friend requests between users.
     *
     * @param {Object} data - The data received from the client, containing the friend's username and the sender's token.
     * @param {string} data.username - The username of the friend to whom the request is being sent.
     * @param {string} data.token - The token of the user sending the friend request.
     *
     * This function performs several steps:
     * 1. Validates the token of the sender to ensure they are authenticated.
     * 2. Fetches the sender's user information from the database.
     * 3. Fetches the receiver's user information based on the provided username.
     * 4. Checks if a friendship already exists between the sender and receiver. If it does and is pending, emits an error.
     * 5. If no pending friendship exists, creates a new friendship document in the database with a status of 'PENDING'.
     * 6. Saves the new friendship ID to both the sender's and receiver's pendingFriendRequests.
     * 7. Emits an event to the sender to confirm the friend request was sent.
     * 8. Emits an event to the receiver with the friend request details.
     *
     * If any errors occur during this process, logs the error and emits an error message to the sender.
     */
    socket.on('sendFriendRequest', async (data) => {
      try {
        const { username: friendUsername, token } = data
        const currentUser = validateToken(token)

        if (!currentUser) {
          console.log('Authentication required')
          socket.emit('error', 'Authentication required')
          return
        }

        const user = await User.findOne({ _id: currentUser.id })
        const receiver = await User.findOne({ username: friendUsername })

        let existingFriendship = await Friendship.findOne({
          $or: [
            { sender: currentUser._id, receiver: receiver._id },
            { sender: receiver._id, receiver: currentUser._id }
          ]
        })

        // If a friendship already exists, create an error
        if (existingFriendship && existingFriendship.status === 'PENDING') {
          socket.emit('error', { error: 'Friend request already sent' })
          return
        }

        // Else create a new friendship
        else {
          const newFriendship = new Friendship({
            sender: user._id,
            receiver: receiver._id,
            status: 'PENDING',
          })

          await newFriendship.save()

          // Push the friendship to both of the user's pending requests
          user.pendingFriendRequests.push(newFriendship._id)
          await user.save()

          receiver.pendingFriendRequests.push(newFriendship._id)
          await receiver.save()

          // Emit the new friendship to catch on the frontend
          socket.emit('friendRequestSent', newFriendship)

          const newFriendshipToFront = { ...newFriendship._doc, userObj: user }

          const receiverSocketId = userSocketIds[receiver._id]
          io.sockets.sockets.get(receiverSocketId).emit('friendRequest', newFriendshipToFront, (error) => {
            if (error) {
              if (!receiverSocketId)
                console.error('user was not connected to a socket, the request was still sent.')
            } else {
              console.log('Friend request sent successfully')
            }
          })
        }
      } catch (error) {
        console.log('Error sending friend request:', error)
        socket.emit('error', { error: 'Error sending friend request' })
      }
    })


    /**
     * Event listener for 'acceptFriendRequest'. Handles the logic for accepting friend requests.
     *
     * @param {Object} data - The data received from the client, containing the friendship ID and the user's token.
     * @param {string} data.friendshipId - The ID of the friendship document representing the friend request.
     * @param {string} data.token - The token of the user accepting the friend request.
     *
     * This function performs several steps:
     * 1. Validates the token of the user to ensure they are authenticated.
     * 2. Fetches the friendship document from the database using the provided friendship ID.
     * 3. Checks if the friendship exists and is in 'PENDING' status. If not, emits an error.
     * 4. Updates the friendship status to 'ACCEPTED' and saves the changes to the database.
     * 5. Updates both the accepting user's and the sender's friend lists to include each other.
     * 6. Emits an event to both the accepting user and the sender to notify them that the friend request has been accepted.
     *
     * If any errors occur during this process, logs the error and emits an error message to the user.
     */
    socket.on('acceptFriendRequest', async (data) => {
      let friendSocketId
      try {
        const { friendshipId, token } = data
        const currentUser = validateToken(token)

        if (!currentUser) {
          socket.emit('error', { error: 'Authentication required' })
          return
        }

        const friendship = await Friendship.findById(friendshipId)
        if (!friendship || friendship.status !== 'PENDING') {
          socket.emit('error', { error: 'Invalid friend request' })
          return
        }

        friendship.status = 'ACCEPTED'
        await friendship.save()

        // Update the user's and friend's friend list
        const user = await User.findById(currentUser.id)
        user.friends.push(friendship.sender)
        await user.save()

        const friend = await User.findById(friendship.sender)
        friend.friends.push(user._id)
        await friend.save()

        io.to(userSocketIds[user._id]).emit('friendRequestAccepted', friendship)

        friendSocketId = userSocketIds[friend._id]
        io.to(friendSocketId).emit('friendRequestAccepted', friendship)

        socket.emit('friendRequestAccepted', friendship)
      } catch (error) {
        if (!friendSocketId)
          console.error('user was not connected to a socket, the request was still sent.')
        else {
          console.log('Error accepting friend request:', error)
          socket.emit('error', { error: 'Error accepting friend request' })
        }
      }
    })


    /**
     * Event listener for 'message'. Handles the logic for sending messages within a conversation.
     *
     * @param {Object} message - The message object received from the client.
     * @param {string} message.token - The token of the user sending the message, used for authentication.
     * @param {string} message.sender - The ID of the user sending the message.
     * @param {string} message.receiver - The ID of the user receiving the message.
     * @param {string} message.content - The content of the message.
     * @param {Array} message.emojis - An array of emojis included in the message.
     * @param {boolean} message.justEmojis - A flag indicating if the message consists only of emojis.
     * @param {string} message.conversationId - The ID of the conversation to which the message belongs.
     *
     * This function performs several steps:
     * 1. Validates the sender's token to ensure they are authenticated.
     * 2. Fetches the conversation from the database using the provided conversation ID.
     * 3. Checks if the conversation exists and if it's a new conversation (no messages yet).
     * 4. Creates a new message document with the provided data and saves it to the database.
     * 5. Adds the new message ID to the conversation's messages array and saves the updated conversation.
     * 6. Broadcasts the new message to both the sender and receiver.
     * 7. If it's a new conversation, broadcasts the conversation to the receiver.
     *
     * If any errors occur during this process, logs the error and emits an error message to the sender.
     */
    socket.on('message', async (message) => {
      const messageData = message
      const currentUser = validateToken(messageData.token)

      if (!currentUser) {
        console.log('Authentication required sending a message')
        socket.emit('error', { error: 'Authentication required' })
      }

      const conversation = await Conversation.findById(messageData.conversationId)
      // If no messages, it's a new conversation
      const isNewConvo = conversation.messages.length === 0

      if (!conversation) {
        console.log('conversation not found')
        socket.emit('error', { error: 'Conversation not found' })
      }

      let newMessage

      try {
        newMessage = new Message({
          sender: messageData.sender,
          receiver: messageData.receiver,
          content: messageData.content,
          emojis: messageData.emojis,
          justEmojis: messageData.justEmojis,
          timestamp: new Date().toISOString(),
          conversationId: conversation._id
        })

        await newMessage.save()

      } catch (error) {
        console.log('something went wrong creating new message')
        console.log(error)
        socket.emit('error', { error: 'Something went wrong creating new message' })
      }

      try {
        conversation.messages.push(newMessage._id)

        await conversation.save()
      } catch (error) {
        console.log('something went wrong updating the conversation')
        socket.emit('error', { error: 'Something went wrong updating the conversation'})
      }

      let receiverSocketId
      try {
        // Broadcast the messages to the sender and receiver
        receiverSocketId = userSocketIds[messageData.receiver]

        io.to(userSocketIds[messageData.sender]).emit('message', newMessage)
        io.to(userSocketIds[messageData.sender]).emit('messageToConvo', newMessage)

        io.to(receiverSocketId).emit('message', newMessage)
        io.to(receiverSocketId).emit('messageToConvo', newMessage)
        if (isNewConvo) {
          // If it's a new conversation, broadcast the conversation to the receiver
          io.to(receiverSocketId).emit('newConversation', conversation)
        }
      } catch (error) {
        if (!receiverSocketId)
          console.error('Receiver not connected to socket, message still sent.')
        else {
          console.error('something went wrong emitting the message: ', error)
        }
      }
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected')
      delete userSocketIds[userId]
    })
  })
}
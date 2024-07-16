/**
 * @fileoverview This file contains the source code for an old backend system that is no longer in use.
 * It was designed to handle user authentication, messaging, and friendship management through a
 * GraphQL API. The system connects to a MongoDB database for data storage and uses Apollo Server
 * for handling GraphQL requests. It includes models for users, messages, friendships, and conversations,
 * and defines GraphQL type definitions and resolvers for various operations such as user creation,
 * login, sending friend requests, and messaging. Note that this backend system has been
 * deprecated and should not be used in production environments.
 *
 * @requires @apollo/server:ApolloServer - Apollo Server for creating the GraphQL server.
 * @requires @apollo/server/standalone:startStandaloneServer - Function from Apollo Server to start the server in a standalone mode.
 * @requires bcrypt - Library for hashing and comparing passwords.
 * @requires jsonwebtoken - Library for generating and verifying JSON Web Tokens (JWT) for authentication.
 * @requires mongoose - MongoDB object modeling tool designed to work in an asynchronous environment.
 * @requires dotenv - Module that loads environment variables from a .env file into process.env.
 * @requires graphql:GraphQLError - Error handling in GraphQL queries and mutations.
 * @requires ./models/User - Mongoose model for users.
 * @requires ./models/Message - Mongoose model for messages.
 * @requires ./models/Friendship - Mongoose model for friendships.
 * @requires ./models/Conversation - Mongoose model for conversations.
 *
 * @deprecated This backend system is deprecated and no longer maintained. It was originally designed for handling user interactions and data management in a social networking context using GraphQL. Consider using or migrating to a more current and supported backend solution.
 */


const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const User = require('./models/User')
const Message = require('./models/Message')
const Friendship = require('./models/Friendship')
const Conversation = require('./models/Conversation')
const { GraphQLError } = require( 'graphql' )

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error)
  })


const typeDefs = `

  enum FriendshipStatus {
    PENDING
    ACCEPTED
    DECLINED
  }

  type Friendship {
    sender: ID!
    receiver: ID!
    status: FriendshipStatus!
    id: ID!
  }

  type Message {
    sender: ID!
    receiver: ID!
    content: String!
    timestamp: String!
  }

  type Conversation {
    id: ID!
    participants: [ID]
    messages: [Message]
  }

  type User {
    username: String!
    name: String!
    phone: String
    city: String
    id: ID!
    pendingFriendRequests: [Friendship]
    friends: [User]
  }

  type Token {
    value: String!
  }

  type Query {
    UserCount: Int!
    allUsers: [User!]!
    allConversations: [Conversation!]!
    findUser(username: String!): User
    findConversationById(convoId: String!): Conversation
    me: User
  }

  type Mutation {
    createUser(username: String!, password: String!, name: String!, phone: String, city: String): User
    login(username: String!, password: String!): Token

    sendFriendRequest(username: String!): Friendship
    acceptFriendRequest(friendshipId: ID!): Friendship
    declineFriendRequest(friendshipId: ID!): Friendship

    sendMessage(username: String!, content: String!): Message
  }
`

const resolvers = {
  Query: {
    UserCount: async () => User.collection.countDocuments,
    allUsers: async () => {
      const users = await User.find({}).populate('pendingFriendRequests')
      return users
    },
    allConversations: async () => {
      const convos = await Conversation.find({}).populate('messages')
      return convos
    },
    findConversationById: async (root, args) => {
      const convo = await Conversation.findById(args.convoId).populate('messages')
      return convo
    },
    findUser: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      return user
    },
    me: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Authentication required', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      try {
        const populatedCurrentUser = await User.findById(currentUser._id).populate('pendingFriendRequests')
        return populatedCurrentUser
      } catch (error) {
        throw new GraphQLError('Error fetching user data', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR'
          }
        })
      }
    }
  },
  User: {
    city: ({ city }) => {
      return city
    },
  },

  Mutation: {
    sendFriendRequest: async (root, args, context) => {
      const friendUsername = args.username
      const currentUser = context.currentUser
      const receiver = await User.findOne({username: friendUsername})

      console.log(currentUser)

      console.log(receiver)

      if (!currentUser) {
        throw new GraphQLError('Authentication required', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      console.log('eikö mee perille')

      const newFriendship = new Friendship({
        sender: currentUser._id,
        receiver: receiver._id,
        status: 'PENDING'
      })

      try {
        await newFriendship.save()

        currentUser.pendingFriendRequests.push(newFriendship._id)
        await currentUser.save()

        receiver.pendingFriendRequests.push(newFriendship._id)
        await receiver.save()

      } catch (error) {
        throw new GraphQLError('Something went wrong saving new friendship state', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR'
          }
        })
      }

      return newFriendship
    },
    acceptFriendRequest: async (root, args, context) => {
      const friendship = await Friendship.findOne({ _id: args.friendshipId})
      const currentUser = context.currentUser
      const requestSender = await User.findOne({ _id: friendship.sender})

      if (!currentUser) {
        throw new GraphQLError('Authentication required', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (currentUser._id.toString() == friendship.receiver) {
        try {
          friendship.status = 'ACCEPTED'
          await friendship.save()
          currentUser.friends.push(friendship.sender)
          requestSender.friends.push(friendship.receiver)
          await currentUser.save()
          await requestSender.save()
        } catch (error) {
          throw new GraphQLError('Error updating friendship status', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            }
          })
        }
      } else {
        throw new GraphQLError('Not authenticated to accept request', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      return friendship
    },
    declineFriendRequest: async (root, args, context) => {
      const friendship = await Friendship.findOne({ _id: args.friendshipId})
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Authentication required', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (currentUser._id.toString() === friendship.receiver) {
        try {
          friendship.status = 'DECLINED'
          await friendship.save()
        } catch (error) {
          throw new GraphQLError('Something went wrong declining the friendship', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            }
          })
        }
      } else {
        throw new GraphQLError('Not authenticated to decline request', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      return friendship
    },
    sendMessage: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Authentication required', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const messageReceiver = await User.findOne({ username: args.username })
      if (!messageReceiver) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      let conversation = await Conversation.findOne({
        participants: {
          $all: [currentUser._id, messageReceiver._id]
        }
      })

      if (!conversation) {
        conversation = new Conversation({
          participants: [currentUser._id, messageReceiver._id],
          messages: []
        })
      }

      if (currentUser.friends.includes(messageReceiver._id)) {
        const currentDate = new Date()
        const timestampString = currentDate.toISOString()

        const newMessage = new Message({
          content: args.content,
          sender: currentUser._id.toString(),
          receiver: messageReceiver._id.toString(),
          timestamp: timestampString
        })

        conversation.messages.push(newMessage._id)

        //currentUser.messages.push(newMessage)
        //messageReceiver.messages.push(newMessage)

        try {
          await newMessage.save()
          //await currentUser.save()
          //await messageReceiver.save()
          await conversation.save()
          return newMessage
        } catch (error) {
          throw new GraphQLError(`Sending the message failed: ${error.message}`, {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            }
          })
        }
      } else {
        throw new GraphQLError('Person is not currently on your friend list', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
    },
    createUser: async (_, { username, password, name, phone, city }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
          username, name, phone, city,
          password: hashedPassword,
          pendingFriendRequests: [],
          friends: []
        })

        const savedUser = await newUser.save()

        const userWithoutPassword = savedUser.toObject()
        delete userWithoutPassword.password

        return userWithoutPassword
      } catch (error) {
        throw new GraphQLError('Something went wrong creating the user', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const { username, password } = args

      try {
        const user = await User.findOne({ username: username })
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
          throw new GraphQLError('Wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }

        const userForToken = {
          username: user.username,
          id: user._id,
          exp: Math.floor(Date.now() / 1000) + (60 * 60) // JWT expires in 1 hour
        }

        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }

      } catch (error) {
        throw new GraphQLError('Something went wrong signing in', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error: error
          }
        })
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})


startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({req, res}) => {
    const auth = req ? req.headers.authorization: null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )

      const currentUser = await User.findById(decodedToken.id)

      return { currentUser }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
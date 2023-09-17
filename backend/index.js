const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const User = require('./models/User')
const Message = require('./models/Message')
const Friendship = require('./models/Friendship')
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
    userA: User!
    userB: User!
    status: FriendshipStatus!
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

  type Message {
    sender: User!
    receiver: User!
    content: String!
    timestamp: String!
    id: ID!
  }

  type Query {
    UserCount: Int!
    allUsers: [User!]!
    findUser(username: String!): User
    me: User
  }

  type Mutation {
    createUser(username: String!, password: String!, name: String!, phone: String, city: String): User
    sendFriendRequest(username: String!): Friendship
    acceptFriendRequest(friendshipId: ID!): Friendship
    declineFriendRequest(friendshipId: ID!): Friendship
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    UserCount: async () => User.collection.countDocuments,
    allUsers: async () => {
      const users = await User.find({})
      return users
    },
    findUser: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      return user
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
      console.log('kamun käyttis')
      console.log(friendUsername)
      const currentUser = context.currentUser
      const receiver = await User.findOne({username: friendUsername})
      console.log(receiver)

      if (!currentUser) {
        throw new GraphQLError('Authentication required', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      console.log(currentUser)
      console.log(friendUsername)

      const newFriendship = new Friendship({
        userA: currentUser,
        userB: receiver,
        status: 'PENDING'
      })

      try {
        await newFriendship.save()

        currentUser.pendingFriendRequests.push(newFriendship)
        await currentUser.save()

        receiver.pendingFriendRequests.push(newFriendship)
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

        console.log('tässä')

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
          id: user._id
        }

        console.log(userForToken)

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
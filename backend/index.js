const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const User = require('./models/User')
const Message = require('./models/Message')

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

  type User {
    username: String!
    name: String!
    phone: String
    city: String
    id: ID!
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

  type Friendship {
    id: ID!
    userA: User!
    userB: User!
    status: String!
  }


  type Mutation {
    createUser(username: String!, password: String!, name: String!, phone: String, city: String): User
    sendFriendRequest(username: String!): Friendship
    acceptFriendRequest(friendshipId: ID!): Friendship
    declineFriendRequest(friendshipId: ID!): Friendship
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
    sendFriendRequest: (root, args) => {
      const { friendUsername } = args.request

    },
    createUser: async (_, { username, password, name, phone, city }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
          username, name, phone, city,
          password: hashedPassword
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
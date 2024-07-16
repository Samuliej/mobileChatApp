const assert = require('assert')
const User = require('../models/User')
const Post = require('../models/Post.js')
const Conversation = require('../models/Conversation.js')
const supertest = require('supertest')
const mongoose  = require('mongoose')
const app = require('../index.js')


const api = supertest(app)

const initialUsers = [
  {
    'username': 'user1',
    'password': 'password1',
    'name': 'User One'
  },
  {
    'username': 'user2',
    'password': 'password2',
    'name': 'User Two'
  },
  {
    'username': 'tokenUser',
    'password': 'salis',
    'name': 'token user'
  }
]

const tokenUser = initialUsers[2]

let postId = null
let user1, user2
let token

beforeAll(async () => {
  let result = await api.post('/api/users').send(tokenUser).expect(201)

  result = await api.post('/api/login').send({ username: tokenUser.username, password: tokenUser.password }).expect(200)
  token = result.body.token


  user1 = new User(initialUsers[0])
  user2 = new User(initialUsers[1])

  await user1.save()
  await user2.save()

  // Add each other as friends
  user1.friends.push(user2._id)
  user2.friends.push(user1._id)

  // Save users again after adding friends
  await user1.save()
  await user2.save()

  // Create post
  const newPost = new Post({
    content: {
      text: 'This is a post before all',
      image: null
    },
    author: user1._id,
  })

  await newPost.save()

  postId = newPost._id

  // Add post to user1's posts
  user1.posts.push(newPost._id)
  await user1.save()
})

test('user with missing mandatory field(s) is not added', async () => {
  let newUser = {
    password: 'password3',
    name: 'User Three',
    phone: '1234567890',
    city: 'Test City'
  }

  let result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.strictEqual(result.body.error, 'Something went wrong creating the user')

  let response = await api.get('/api/users').set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response.body.length, initialUsers.length)

  // No password
  newUser = {
    username: 'username3',
    name: 'User Three',
    phone: '1234567890',
    city: 'Test City'
  }

  result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.strictEqual(result.body.error, 'Something went wrong creating the user')

  response = await api.get('/api/users').set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response.body.length, initialUsers.length)

  // No name
  newUser = {
    username: 'username3',
    password: 'testpass',
    phone: '1234567890',
    city: 'Test City'
  }

  result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.strictEqual(result.body.error, 'Something went wrong creating the user')

  response = await api.get('/api/users').set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response.body.length, initialUsers.length)
})

test('a valid user can be added', async () => {
  const newUser = {
    username: 'user3',
    password: 'password3',
    name: 'User Three',
    phone: '1234567890',
    city: 'Test City'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/users').set('Authorization', `Bearer ${token}`)

  const usernames = response.body.map(r => r.username)

  assert.strictEqual(response.body.length, initialUsers.length + 1)
  assert(usernames.includes(newUser.username))
})

test('user can login', async () => {
  const newUser = {
    username: 'user10',
    password: 'password10',
    name: 'User One',
    phone: '1234567890',
    city: 'Test City'
  }

  // Create user
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  // Login
  const result = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
    .expect(200)

  // Check if token is returned
  assert.ok(result.body.token)
})

test('authenticated user can send friend requests', async () => {

  const newUser = {
    username: 'authenticated',
    password: 'password',
    name: 'authenticated'
  }

  // Create user
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)


  // Login
  const result = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
    .expect(200)

  const token = result.body.token

  // Send friend request
  await api
    .post('/api/sendFriendRequest')
    .set('Authorization', `Bearer ${token}`)
    .send({ username: initialUsers[1].username })
    .expect(201)
})

test('authenticated user can create posts', async () => {
  const newUser = {
    username: 'poster',
    password: 'password',
    name: 'User',
    phone: '1234567890',
    city: 'Test City'
  }

  // Create user
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  // Login
  const result = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
    .expect(200)

  const token = result.body.token
  const loggedInUser = await User.findOne({username: newUser.username})

  // Create post
  const newPost = {
    content: 'This is a test post',
    comments: [],
    likes: 0,
    author: loggedInUser._id,
    createdAt: Date.now()
  }

  await api
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send(newPost)
    .expect(201)
})


test('a valid comment can be added to a post', async () => {
  const newUser = {
    username: 'commenter',
    password: 'password',
    name: 'User',
    phone: '1234567890',
    city: 'Test City'
  }

  // Create user
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  // Login
  const result = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
    .expect(200)

  const token = result.body.token

  const newComment = {
    content: 'This is a test comment',
    postId: postId
  }

  await api
    .post(`/api/posts/${postId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send(newComment)
    .expect(201)

  const postAfterComment = await Post.findById(postId)
  const commentsAfterPost = postAfterComment.comments

  expect(commentsAfterPost).toHaveLength(1)
})


test('authorized user can start a conversation', async () => {
  let newUser = {
    username: 'conversationStarter',
    password: 'password',
    name: 'convo'
  }

  const receivingUser = {
    username: 'receivingUser',
    password: 'password',
    name: 'receiver'
  }

  // Create user
  let result = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const createdNewUser = result.body

  // Login
  result = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
    .expect(200)

  const newUserToken = result.body.token

  result = await api
    .post('/api/users')
    .send(receivingUser)
    .expect(201)

  const createdReceivingUser = result.body

  result = await api
    .post('/api/login')
    .send({ username: receivingUser.username, password: receivingUser.password })
    .expect(200)

  const receivingUserToken = result.body.token

  result = await api
    .post('/api/sendFriendRequest')
    .set('Authorization', `Bearer ${newUserToken}`)
    .send({ username: receivingUser.username })
    .expect(201)

  const friendship = result.body

  console.log('friendship at post.test', friendship)

  result = await api
    .put('/api/acceptFriendRequest')
    .set('Authorization', `Bearer ${receivingUserToken}`)
    .send({ friendshipId: friendship._id })
    .expect(200)

  result = await api
    .post('/api/startConversation')
    .set('Authorization', `Bearer ${newUserToken}`)
    .send({ username: receivingUser.username })
    .expect(201)

  const conversation = result.body.conversation

  expect(conversation.participants).toContain(createdNewUser._id.toString())
  expect(conversation.participants).toContain(createdReceivingUser._id.toString())
}, 10000)


afterAll(async () => {
  await User.deleteMany({})
  await Post.deleteMany({})
  await Conversation.deleteMany({})
  await mongoose.connection.close()
})
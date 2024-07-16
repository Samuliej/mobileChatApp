const User = require('../models/User')
const Post = require('../models/Post.js')
const supertest = require('supertest')
const mongoose  = require('mongoose')
const app = require('../index.js')
const Friendship = require('../models/Friendship.js')
const Conversation = require('../models/Conversation.js')

const api = supertest(app)

let createdUser1, createdUser2, createdUser3
let user1, user2, user3
let user1Token, user2Token, user3Token
let postId
let convoId

beforeAll(async () => {
  await Conversation.deleteMany({})
  // Create users
  user1 = {
    username: 'user1',
    password: 'password1',
    name: 'User One'
  }

  user2 = {
    username: 'user2',
    password: 'password2',
    name: 'User Two'
  }

  user3 = {
    username: 'user3',
    password: 'password3',
    name: 'User Three'
  }

  // Register users
  let result = await api.post('/api/users').send(user1).expect(201)
  createdUser1 = result.body

  result = await api.post('/api/users').send(user2).expect(201)
  createdUser2 = result.body

  result = await api.post('/api/users').send(user3).expect(201)
  createdUser3 = result.body

  // Login users
  result = await api.post('/api/login').send({ username: user1.username, password: user1.password }).expect(200)
  user1Token = result.body.token

  result = await api.post('/api/login').send({ username: user2.username, password: user2.password }).expect(200)
  user2Token = result.body.token

  result = await api.post('/api/login').send({ username: user3.username, password: user3.password }).expect(200)
  user3Token = result.body.token

  // Send friend requests
  await api.post('/api/sendFriendRequest').set('Authorization', `Bearer ${user1Token}`).send({ username: user2.username }).expect(201)
  await api.post('/api/sendFriendRequest').set('Authorization', `Bearer ${user2Token}`).send({ username: user3.username }).expect(201)
  await api.post('/api/sendFriendRequest').set('Authorization', `Bearer ${user3Token}`).send({ username: user1.username }).expect(201)

  // Accept friend requests
  let friendship = await api.get('/api/friendRequests').set('Authorization', `Bearer ${user2Token}`).expect(200)
  await api.put('/api/acceptFriendRequest').set('Authorization', `Bearer ${user2Token}`).send({ friendshipId: friendship.body[0]._id }).expect(200)

  friendship = await api.get('/api/friendRequests').set('Authorization', `Bearer ${user3Token}`).expect(200)
  await api.put('/api/acceptFriendRequest').set('Authorization', `Bearer ${user3Token}`).send({ friendshipId: friendship.body[0]._id }).expect(200)

  // Start a conversation between user1 and user2
  result = await api.post('/api/startConversation').set('Authorization', `Bearer ${user1Token}`).send({ username: user2.username }).expect(201)
  const conversation = result.body.conversation
  convoId = conversation._id

  // Check if the conversation was started successfully
  expect(conversation.participants).toContain(createdUser1._id.toString())
  expect(conversation.participants).toContain(createdUser2._id.toString())

  // Create post
  const newPost = {
    content: 'This is a test post',
    author: createdUser1._id,
  }

  result = await api.post('/api/posts').set('Authorization', `Bearer ${user1Token}`).send(newPost).expect(201)
  postId = result.body._id
})

test('GET /api/users returns all users without passwords', async () => {
  const response = await api.get('/api/users')
    .set('Authorization', `Bearer ${user1Token}`)
    .expect(200)

  expect(response.body).toHaveLength(3)

  response.body.forEach(user => {
    expect(user).toHaveProperty('username')
    expect(user).toHaveProperty('name')
    expect(user).not.toHaveProperty('password')
  })
})

test('GET /api/conversations returns all conversations', async () => {
  const response = await api.get('/api/conversations')
    .set('Authorization', `Bearer ${user1Token}`)
    .expect(200)

  expect(response.body).toHaveLength(1)

  response.body.forEach(convo => {
    expect(convo).toHaveProperty('participants')
    expect(convo).toHaveProperty('messages')
  })
})

test('GET /api/users/:username returns the correct user', async () => {
  const response = await api.get(`/api/users/${user1.username}`)
    .set('Authorization', `Bearer ${user1Token}`)
    .expect(200)

  expect(response.body.username).toBe(user1.username)
  expect(response.body.name).toBe(user1.name)
})

test('GET /api/users/id/:userId returns the correct user', async () => {
  const response = await api.get(`/api/users/id/${createdUser1._id}`)
    .set('Authorization', `Bearer ${user1Token}`)
    .expect(200)

  expect(response.body._id).toBe(createdUser1._id.toString())
  expect(response.body.username).toBe(user1.username)
  expect(response.body.name).toBe(user1.name)
  expect(response.body).not.toHaveProperty('password')
})

test('GET /api/username/:username correctly identifies a taken username', async () => {
  const response = await api.get(`/api/username/${user1.username}`).expect(200)

  expect(response.body.isTaken).toBe(true)
})

test('GET /api/username/:username correctly identifies a not taken username', async () => {
  const response = await api.get('/api/username/nonexistentusername').expect(200)

  expect(response.body.isTaken).toBe(false)
})

test('GET /api/users/search/:query returns the correct users', async () => {
  // Users created in beforeAll
  const firstResponse = await api.get('/api/users/search/user?page=1')
    .set('Authorization', `Bearer ${user1Token}`)
    .expect(200)
  expect(firstResponse.body).toHaveLength(3)

  // Create more users for testing pagination
  for (let i = 5; i <= 11; i++) {
    const user = {
      username: `user${i}`,
      password: `password${i}`,
      name: `User ${i}`
    }
    await api.post('/api/users').send(user).expect(201)
  }

  // Search for users with username starting with 'user'
  const response = await api.get('/api/users/search/user?page=1')
    .set('Authorization', `Bearer ${user1Token}`)
    .expect(200)

  expect(response.body).toHaveLength(5)
  response.body.forEach(user => {
    expect(user.username).toMatch(/^user/)
    expect(user).not.toHaveProperty('password')
  })

  // Check second page
  const response2 = await api.get('/api/users/search/user?page=2')
    .set('Authorization', `Bearer ${user1Token}`)
    .expect(200)

  expect(response2.body).toHaveLength(5) // Now it should receive 5 users
  response2.body.forEach(user => {
    expect(user.username).toMatch(/^user/)
    expect(user).not.toHaveProperty('password')
  })
})

test('GET /api/conversations/:convoId returns the correct conversation', async () => {
  const response = await api.get(`/api/conversations/${convoId}`)
    .set('Authorization', `Bearer ${user1Token}`)
    .expect(200)

  expect(response.body.conversation._id).toBe(convoId)
  expect(response.body.conversation.participants).toHaveLength(2)
  expect(response.body.conversation.participants).toContainEqual(expect.objectContaining({
    _id: createdUser1._id.toString()
  }))
  expect(response.body.conversation.participants).toContainEqual(expect.objectContaining({
    _id: createdUser2._id.toString()
  }))
})


test('GET /api/me returns the correct user', async () => {
  // Log in as user1
  const loginResponse = await api.post('/api/login').send({
    username: user1.username,
    password: user1.password
  }).expect(200)

  const token = loginResponse.body.token

  // Fetch current user
  const response = await api.get('/api/me')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)

  expect(response.body._id).toBe(createdUser1._id.toString())
  expect(response.body.username).toBe(user1.username)
  expect(response.body).not.toHaveProperty('password')
})

test('GET /api/me returns 401 if not authenticated', async () => {
  const response = await api.get('/api/me').expect(401)

  expect(response.body.error).toBe('Token not provided')
})


test('GET /api/friendRequests returns the correct friend requests', async () => {
  // Log in as user1
  const loginResponse = await api.post('/api/login').send({
    username: user1.username,
    password: user1.password
  }).expect(200)

  const token = loginResponse.body.token

  // Fetch friend requests
  const response = await api.get('/api/friendRequests')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)

  response.body.forEach(request => {
    expect(request.sender._id).toBe(createdUser3._id.toString())
    expect(request.status).toBe('PENDING')
  })
})

test('GET /api/posts/user/:userId returns the correct posts', async () => {
  // Log in as user1
  const loginResponse = await api.post('/api/login').send({
    username: user1.username,
    password: user1.password
  }).expect(200)

  const token = loginResponse.body.token

  // Fetch user's posts
  const response = await api.get(`/api/posts/user/${createdUser1._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)

  response.body.forEach(post => {
    expect(post.author).toBe(createdUser1._id.toString())
    expect(post).toHaveProperty('comments')
    expect(post._id).toBe(postId)
  })
})


test('GET /api/posts/friends/:userId returns the correct posts', async () => {
  // Log in as user2
  const loginResponse = await api.post('/api/login').send({
    username: user2.username,
    password: user2.password
  }).expect(200)

  const token = loginResponse.body.token

  // Fetch friends' posts
  const response = await api.get(`/api/posts/friends/${createdUser1._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)

  response.body.forEach(post => {
    expect(post.author._id).toBe(createdUser1._id.toString())
    expect(post).toHaveProperty('comments')
    expect(post._id).toBe(postId)
  })
})

afterAll(async () => {
  await User.deleteMany({})
  await Friendship.deleteMany({})
  await Post.deleteMany({})
  await Conversation.deleteMany({})
  await mongoose.connection.close()
})
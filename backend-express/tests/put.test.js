const User = require('../models/User')
const Post = require('../models/Post.js')
const supertest = require('supertest')
const mongoose  = require('mongoose')
const app = require('../index.js')
const Friendship = require('../models/Friendship.js')

const api = supertest(app)

let createdPost
let postId
let newUser, receivingUser, decliningUser
let newUserToken, receivingUserToken, decliningUserToken

beforeAll(async () => {
  let result

  newUser = {
    username: 'authenticated',
    password: 'password',
    name: 'authenticated'
  }

  receivingUser = {
    username: 'receiver',
    password: 'password',
    name: 'receiver'
  }

  decliningUser = {
    username: 'decliner',
    password: 'password',
    name: 'decliner'
  }

  // Create user
  result = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const createdNewUser = result.body

  // Create user
  await api
    .post('/api/users')
    .send(receivingUser)
    .expect(201)

  await api
    .post('/api/users')
    .send(decliningUser)
    .expect(201)

  // Login
  result = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
    .expect(200)

  newUserToken = result.body.token

  result = await api
    .post('/api/login')
    .send({ username: receivingUser.username, password: receivingUser.password })
    .expect(200)

  receivingUserToken = result.body.token

  result = await api
    .post('/api/login')
    .send({ username: decliningUser.username, password: decliningUser.password })
    .expect(200)

  decliningUserToken = result.body.token

  // Create post
  const newPost = {
    content: 'This is a test post',
    author: createdNewUser._id,
  }

  result = await api
    .post('/api/posts')
    .set('Authorization', `Bearer ${newUserToken}`)
    .field('content', newPost.content)
    .field('author', newPost.author)
    .attach('image', null)
    .expect(201)

  createdPost = result.body
  console.log('created post at test', createdPost)
  postId = createdPost._id
})

test('Authenticated user can accept friend requests', async() => {
  let  result

  // Send friend request
  result = await api
    .post('/api/sendFriendRequest')
    .set('Authorization', `Bearer ${newUserToken}`)
    .send({ username: receivingUser.username })
    .expect(201)

  const friendship = result.body

  result = await api
    .put('/api/acceptFriendRequest')
    .set('Authorization', `Bearer ${receivingUserToken}`)
    .send({ friendshipId: friendship._id })
    .expect(200)

  const acceptedFriendship = result.body

  expect(acceptedFriendship.status).toBe('ACCEPTED')
})

test('authenticated user can decline a friend request', async () => {
  let result = await api
    .post('/api/sendFriendRequest')
    .set('Authorization', `Bearer ${newUserToken}`)
    .send({ username: decliningUser.username })
    .expect(201)

  const friendship = result.body

  // Decline friend request
  result = await api
    .put(`/api/declineFriendRequest/${friendship._id}`)
    .set('Authorization', `Bearer ${decliningUserToken}`)
    .expect(200)

  // Check that the friendship has been deleted
  result = await api
    .get(`/api/friendship/${friendship._id}`)
    .set('Authorization', `Bearer ${decliningUserToken}`)
    .expect(404)
})

test('authorized user can like a post', async () => {
  let result = await api
    .put(`/api/likePost/${postId}/like`)
    .set('Authorization', `Bearer ${receivingUserToken}`)
    .expect(200)

  const likedPost = result.body

  expect(likedPost.likes).toBe(createdPost.likes + 1)
})

afterAll(async () => {
  await User.deleteMany({})
  await Friendship.deleteMany({})
  await Post.deleteMany({})
  await mongoose.connection.close()
})
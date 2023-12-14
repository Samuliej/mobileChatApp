/* eslint-disable no-undef */
const app = require('../index')
const User = require('../models/User')
const Message = require('../models/Message')
const Conversation = require('../models/Conversation')
const Friendship = require('../models/Friendship')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const api = supertest(app)
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username
  }
  return jwt.sign(payload, process.env.JWT_SECRET)
}

// Tests where no authentication is needed
describe('test for api endpoint GET', () => {
  let user1, user2, message, conversation

  beforeEach(async () => {
    await User.deleteMany({})
    await Message.deleteMany({})
    await Conversation.deleteMany({})
    await Friendship.deleteMany({})

    user1 = new User({
      username: 'user1',
      name: 'User One',
      phone: '123456789',
      city: 'City One',
      password: 'password'
    })


    await user1.save()

    user2 = new User({
      username: 'user2',
      name: 'User Two',
      phone: '123456789',
      city: 'City Two',
      password: 'password'
    })

    await user2.save()


    const friendship = new Friendship({
      sender: user1._id,
      receiver: user2._id,
      status: 'PENDING'
    })


    await friendship.save()

    user1.pendingFriendRequests = user1.pendingFriendRequests.concat(friendship._id)
    user2.pendingFriendRequests = user2.pendingFriendRequests.concat(friendship._id)

    await user1.save()
    await user2.save()

    const acceptedFriendship = await Friendship.findByIdAndUpdate(friendship._id, { status: 'ACCEPTED' }, { new: true })
    acceptedFriendship.save()

    user1.friends.push(user2._id)
    user2.friends.push(user1._id)

    await user1.save()
    await user2.save()

    conversation = new Conversation({
      participants: [user1._id, user2._id],
      messages: []
    })
    await conversation.save()

    user1.conversations = user1.conversations.concat(conversation._id)
    user2.conversations = user2.conversations.concat(conversation._id)

    message = new Message({
      sender: user1._id,
      receiver: user2._id,
      content: 'Hello',
      timestamp: '2020-01-01'
    })

    await message.save()

    conversation.messages = conversation.messages.concat(message._id)
    await conversation.save()
  })


  test('GET /api/users returns all users', async () => {
    const response = await api.get('/api/users')
    expect(response.body.length).toBe(2)
  })


  test('Correct user is returned', async () => {
    const response = await api.get('/api/users')
    expect(response.body[0].username).toBe('user1')
  })


  test('fetching conversations returns all conversations and correct data', async () => {
    const response = await api.get('/api/conversations')
    expect(response.body.length).toBe(1)
    expect(response.body[0].participants[0]).toBe(user1._id.toString())
    expect(response.body[0].participants[1]).toBe(user2._id.toString())
    expect(response.body[0].messages.length).toBe(1)
    expect(response.body[0].messages[0]).toBe(message._id.toString())
  })


  test('fetching user by username returns correct user', async () => {
    const response = await api.get('/api/users/user1')
    expect(response.body.username).toBe('user1')
  })

  test('returns true if username is taken', async () => {
    const response = await api.get('/api/username/user1')
    expect(response.body.isTaken).toBe(true)
  })

  test('returns false if username is not taken', async () => {
    const response = await api.get('/api/username/nonexistentuser')
    expect(response.body.isTaken).toBe(false)
  })


  test('fetching conversation by ID returns correct conversation', async () => {
    const response = await api.get(`/api/conversations/${conversation._id}`)
    expect(response.body._id).toBe(conversation._id.toString())
  })
})


// Tests where authentication is needed
describe('authenticated endpoints', () => {
  let user, user2

  beforeEach(async () => {
    await User.deleteMany({})
    await Message.deleteMany({})
    await Conversation.deleteMany({})
    await Friendship.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    user = new User({
      username: 'user1',
      name: 'User One',
      phone: '123456789',
      city: 'City One',
      password: passwordHash
    })

    const user2PasswordHash = await bcrypt.hash('sekret2', 10)
    user2 = new User({
      username: 'user2',
      name: 'User Two',
      phone: '123456789',
      city: 'City Two',
      password: user2PasswordHash
    })

    await user.save()
    await user2.save()
  })

  test('authenticated user can fetch his own info', async () => {
    const token = generateToken(user)
    await api
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  test('unauthenticated user cannot fetch his own info', async () => {
    await api
      .get('/api/me')
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })


  test('authenticated user can send friend request', async () => {
    const token = generateToken(user)

    const response = await api
      .post('/api/sendFriendRequest')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: user2.username })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.sender).toBe(user._id.toString())
    expect(response.body.receiver).toBe(user2._id.toString())
    expect(response.body.status).toBe('PENDING')

    const updatedUser = await User.findById(user._id)
    expect(updatedUser.pendingFriendRequests.map(request => request.toString())).toContain(response.body._id)

    const updatedUser2 = await User.findById(user2._id)
    expect(updatedUser2.pendingFriendRequests.map(request => request.toString())).toContain(response.body._id)
  })


  test('authenticated user can accept friend request', async () => {
    const token = generateToken(user)
    const token2 = generateToken(user2)

    const response = await api
      .post('/api/sendFriendRequest')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: user2.username })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response2 = await api
      .post('/api/acceptFriendRequest')
      .set('Authorization', `Bearer ${token2}`)
      .send({ friendshipId: response.body._id })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response2.body.status).toBe('ACCEPTED')

    const updatedUser = await User.findById(user._id)
    expect(updatedUser.friends.map(friend => friend.toString())).toContain(user2._id.toString())
    expect(updatedUser.pendingFriendRequests.map(request => request.toString())).not.toContain(response.body._id)

    const updatedUser2 = await User.findById(user2._id)
    expect(updatedUser2.friends.map(friend => friend.toString())).toContain(user._id.toString())
    expect(updatedUser2.pendingFriendRequests.map(request => request.toString())).not.toContain(response.body._id)
  })


  test('authenticated user can send a message', async () => {
    const token = generateToken(user)
    const token2 = generateToken(user2)

    const message = {
      username: user2.username,
      content: 'Hello'
    }

    const response = await api
      .post('/api/sendFriendRequest')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: user2.username })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response2 = await api
      .post('/api/acceptFriendRequest')
      .set('Authorization', `Bearer ${token2}`)
      .send({ friendshipId: response.body._id })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response3 = await api
      .post('/api/sendMessage')
      .set('Authorization', `Bearer ${token}`)
      .send(message)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedUser = await User.findById(user._id)
    const updatedUser2 = await User.findById(user2._id)

    const conversation = response3.body.conversation
    console.log(conversation)
    const sentMessage = response3.body.message
    console.log(sentMessage)
    expect(conversation.participants[0]).toContain(user._id.toString())
    expect(conversation.participants[1]).toContain(user2._id.toString())

    expect(conversation.messages[0]).toContain(sentMessage._id.toString())

    expect(updatedUser.conversations.map(convo => convo.toString())).toContain(conversation._id.toString())
    expect(updatedUser2.conversations.map(convo => convo.toString())).toContain(conversation._id.toString())
  })


  test('authenticated user can decline friend request', async () => {
    const token = generateToken(user)
    const token2 = generateToken(user2)

    const response = await api
      .post('/api/sendFriendRequest')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: user2.username })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response2 = await api
      .put(`/api/declineFriendRequest/${response.body._id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response2.body.status).toBe('DECLINED')
  })
})
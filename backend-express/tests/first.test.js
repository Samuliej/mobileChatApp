const assert = require('assert')
const User = require('../models/User')
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
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  let userObj = new User(initialUsers[0])
  await userObj.save()
  userObj = new User(initialUsers[1])
  await userObj.save()
})

test('there are two users', async () => {
  const response = await api.get('/api/users')

  assert.strictEqual(response.body.length, initialUsers.length)
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
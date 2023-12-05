/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../index')
//const mongoose = require('mongoose')

let token

beforeAll(async () => {
  const response = await request(app)
    .post('/api/login')
    .send({ username: 'testuser', password: 'testpassword' })

  token = response.body.token
})

test('should fetch all users', async () => {
  const response = await request(app).get('/api/users')
  expect(response.status).toBe(200)
  expect(Array.isArray(response.body)).toBe(true)
})


test('should fetch all conversations', async () => {
  const response = await request(app).get('/api/conversations')
  expect(response.status).toBe(200)
  expect(Array.isArray(response.body)).toBe(true)
})


test('should fetch user by username', async () => {
  const response = await request(app).get('/api/users/testuser')
  expect(response.status).toBe(200)
  expect(response.body.username).toBe('testuser')
})


test('should fetch conversation by ID', async () => {
  const response = await request(app).get('/api/conversations/5f9b2f1e4e5d5a2f1c5d6b4a')
  expect(response.status).toBe(200)
  expect(response.body._id).toBe('5f9b2f1e4e5d5a2f1c5d6b4a')
})


test('should fetch current user', async () => {
  const response = await request(app)
    .get('/api/me')
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toBe(200)
  expect(response.body.username).toBe('testuser')
})


test('should not fetch current user if unauthorized', async () => {
  const response = await request(app).get('/api/me')

  expect(response.status).toBe(401) // 401 Unauthorized
})


test('should fetch friend requests', async () => {
  const response = await request(app)
    .get('/api/friendRequests')
    .set('Authorization', `Bearer ${token}`)

  expect(response.status).toBe(200)
  // Just checking if there is a body in the response
  expect(Array.isArray(response.body)).toBe(true)
})
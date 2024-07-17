/**
 * Main server file for setting up the Express application.
 * This includes configuration for MongoDB, setting up middleware,
 * initializing routes, and starting the server.
 *
 * @module index
 */


const express = require('express')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const mongoose = require('mongoose')
const cors = require('cors')
const setupSockets = require('./socketManager.js')

const getRoutes = require('./routes/get')
const postRoutes = require('./routes/post')
const putRoutes = require('./routes/put')
const deleteRoutes = require('./routes/delete')


/**
 * Configures the MongoDB URI based on the environment.
 * Uses the test database URI if the NODE_ENV is 'test',
 * otherwise uses the main database URI.
 */
let MONGODB_URI
if (process.env.NODE_ENV !== 'test') {
  MONGODB_URI = config.MONGODB_URI
} else {
  MONGODB_URI = config.MONGODB_TEST_URI
}

console.log('connecting to MongoDB')

/**
 * Connects to MongoDB using Mongoose with the configured URI.
 * Logs a success message on successful connection or an error on failure.
 */
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    if (process.env.NODE_ENV !== 'test')
      console.log('Connected to MongoDB')
  })
  .catch((error) => {
    if (process.env.NODE_ENV !== 'test')
      console.log('error connecting to MongoDB: ', error)
  })

const app = express()
const server = require('http').createServer(app)

// Middleware setup
app.use(bodyParser.json())
app.use(cors())

// initialize the routes
app.use(getRoutes)
app.use(postRoutes)
app.use(putRoutes)
app.use(deleteRoutes)


/**
 * Health check route to confirm the server is running.
 */
app.get('/', (req, res) => {
  res.send('Backend server is running!')
})

const port = config.PORT || 3000

// initializes WebSocket communication with socket.io
setupSockets(server, {
  transports: ['websocket'],
  pingInterval: 1000 * 60 * 5,
  pingTimeout: 1000 * 60 * 3
})

/**
 * Starts the server on the configured port if not in test environment.
 */
if (config.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

module.exports = app
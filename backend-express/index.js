const express = require('express')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const mongoose = require('mongoose')
const cors = require('cors')
const WebSocket = require('ws')
const jwt = require('jsonwebtoken')

const getRoutes = require('./routes/get')
const postRoutes = require('./routes/post')
const putRoutes = require('./routes/put')


let MONGODB_URI
if (process.env.NODE_ENV !== 'test') {
  MONGODB_URI = config.MONGODB_URI
} else {
  MONGODB_URI = config.MONGODB_TEST_URI
}

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    return !!decoded
  } catch (err) {
    return false
  }
}


console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    console.log(MONGODB_URI)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error)
  })

const app = express()
const server = require('http').createServer(app)
const wss = new WebSocket.Server({ server })
const postwsRoutes = require('./routes/postws')(app, wss)

app.use(bodyParser.json())

// initialize the routes
app.use(cors())
app.use(getRoutes)
app.use(postRoutes)
app.use(putRoutes)
app.use(postwsRoutes)

const port = config.PORT || 3000
const wsPort = config.WS_PORT || 3002

if (config.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
  server.listen(wsPort, () => {
    console.log(`WebSocket Server is running on port ${wsPort}`)
  })
}

module.exports = app
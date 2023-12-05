const express = require('express')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const mongoose = require('mongoose')

const getRoutes = require('./routes/get')
const postRoutes = require('./routes/post')
const putRoutes = require('./routes/put')

require('dotenv').config()

const MONGODB_URI = config.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error)
  })

const app = express()
const port = config.PORT || 3000

app.use(bodyParser.json())

// initialize the routes
app.use(getRoutes)
app.use(postRoutes)
app.use(putRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

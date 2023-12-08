const express = require('express')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const mongoose = require('mongoose')
const cors = require('cors')

const getRoutes = require('./routes/get')
const postRoutes = require('./routes/post')
const putRoutes = require('./routes/put')

let MONGODB_URI
if (process.env.NODE_ENV !== 'test') {
  MONGODB_URI = config.MONGODB_URI
} else {
  MONGODB_URI = config.MONGODB_TEST_URI
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
const port = config.PORT || 3000

app.use(bodyParser.json())

// initialize the routes
app.use(cors())
app.use(getRoutes)
app.use(postRoutes)
app.use(putRoutes)

if (config.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

module.exports = app
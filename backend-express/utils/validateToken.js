const jwt = require('jsonwebtoken')
const config = require('./config')

// Function for validating a json webtoken
const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    return decoded
  } catch (err) {
    console.log('Token validation failed:', err)
    return null
  }
}

module.exports = validateToken
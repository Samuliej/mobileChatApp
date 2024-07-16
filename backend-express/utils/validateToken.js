const jwt = require('jsonwebtoken')
const config = require('./config')


/**
 * Validates a JWT token using the secret from the configuration.
 *
 * @param {string} token - The JWT token to be validated.
 * @returns {object|null} The decoded token if validation is successful, otherwise null.
 */
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
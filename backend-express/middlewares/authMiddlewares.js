const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../utils/config')

// Middleware for authenticating users
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    try {
      const decodedToken = jwt.verify(token, config.JWT_SECRET)
      const user = await User.findById(decodedToken.id)
      req.currentUser = user
    } catch (err) {
      console.error(err)
      return res.status(401).json({ error: 'Token not authenticated' })
    }
  } else {
    return res.status(401).json({ error: 'Token not provided' })
  }
  next()
}

module.exports = authMiddleware
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../utils/config')

/**
 * Middleware for authenticating JWT tokens in Express applications.
 * It checks for a JWT token in the Authorization header, verifies it,
 * and attaches the authenticated user to the request object.
 * If the token is not provided, not authenticated, or expired, it sends a 401 Unauthorized response.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 * @async
 *
 * @example
 * const express = require('express');
 * const authMiddleware = require('./authMiddleware');
 * const app = express();
 * app.use(authMiddleware);
 */
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
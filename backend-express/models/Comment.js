const mongoose = require('mongoose')


/**
 * Mongoose schema for comments.
 * Defines the structure of a comment document within the database, including references to the post and user it belongs to,
 * the content of the comment, and the timestamp of its creation.
 *
 * @module Comment
 * @typedef {Object} Comment
 * @property {mongoose.Schema.Types.ObjectId} post - The ID of the post this comment is associated with.
 * @property {mongoose.Schema.Types.ObjectId} user - The ID of the user who created the comment.
 * @property {string} content - The textual content of the comment.
 * @property {Date} createdAt - The date and time when the comment was created. Defaults to the current date and time.
 */
const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Comment', commentSchema)

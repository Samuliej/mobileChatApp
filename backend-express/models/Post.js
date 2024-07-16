const mongoose = require('mongoose')


/**
 * Mongoose schema for posts.
 * Defines the structure of a post document within the database, including the content of the post (text and optional image),
 * an array of comments, a count of likes, an array of users who liked the post, the author of the post, and the creation timestamp.
 *
 * @module Post
 * @typedef {Object} Post
 * @property {Object} content - The content of the post, including text (required) and an optional image URL.
 * @property {Array<mongoose.Schema.Types.ObjectId>} comments - An array of comment IDs associated with the post.
 * @property {number} likes - The number of likes the post has received. Defaults to 0.
 * @property {Array<mongoose.Schema.Types.ObjectId>} likedBy - An array of user IDs who have liked the post.
 * @property {mongoose.Schema.Types.ObjectId} author - The ID of the user who authored the post. Required.
 * @property {Date} createdAt - The date and time when the post was created. Defaults to the current date and time.
 */
const postSchema = new mongoose.Schema({
  content: {
    text: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    }
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post

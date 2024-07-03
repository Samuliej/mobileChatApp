const mongoose = require('mongoose')

/*

  Mongoose Schema for a single Post.
  The post contains content, which includes text content and image content.
  There are also fields for comments, likes and fields for author and a
  timestamp when it's created

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

const mongoose = require('mongoose')

/*

  Mongoose Schema for a single User.
  The user contains mandatory fields, username, password an name.
  There are also non-mandatory fields: profile picture, phone and city.

  Inside the user are also fields for
  pending friend requests, friends, converastions that the user is a part of and
  the posts that the user has made.

*/

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  profilePicture: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  pendingFriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Friendship' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
})

module.exports = mongoose.model('User', schema)
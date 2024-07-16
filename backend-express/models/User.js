const mongoose = require('mongoose')


/**
 * Mongoose schema for users.
 * Defines the structure of a user document within the database, including username, password, personal information (name, profile picture, phone, city),
 * and relationships with other entities in the system (pending friend requests, friends, conversations, and posts).
 *
 * @module User
 * @typedef {Object} User
 * @property {string} username - The user's username. Must be unique and at least 3 characters long.
 * @property {string} password - The user's password. Required and must be at least 5 characters long.
 * @property {string} name - The user's full name. Required and must be at least 3 characters long.
 * @property {string} profilePicture - The URL to the user's profile picture. Optional.
 * @property {string} phone - The user's phone number. Optional.
 * @property {string} city - The city the user resides in. Optional.
 * @property {Array<mongoose.Schema.Types.ObjectId>} pendingFriendRequests - An array of IDs representing friend requests the user has received but not yet responded to.
 * @property {Array<mongoose.Schema.Types.ObjectId>} friends - An array of IDs representing the user's friends.
 * @property {Array<mongoose.Schema.Types.ObjectId>} conversations - An array of IDs representing conversations the user is part of.
 * @property {Array<mongoose.Schema.Types.ObjectId>} posts - An array of IDs representing posts created by the user.
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
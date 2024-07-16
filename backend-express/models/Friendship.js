const mongoose = require('mongoose')


/**
 * Mongoose schema for friendships.
 * Defines the structure of a friendship document within the database, including references to the sender and receiver users,
 * and the status of the friendship.
 *
 * @module Friendship
 * @typedef {Object} Friendship
 * @property {mongoose.Schema.Types.ObjectId} sender - The ID of the user who initiated the friendship request.
 * @property {mongoose.Schema.Types.ObjectId} receiver - The ID of the user who received the friendship request.
 * @property {string} status - The current status of the friendship request. Can be 'PENDING', 'ACCEPTED', or 'DECLINED'.
 */
const friendshipSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'ACCEPTED', 'DECLINED']
  }
})

module.exports = mongoose.model('Friendship', friendshipSchema)
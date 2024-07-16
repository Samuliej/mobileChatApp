const mongoose = require('mongoose')


/**
 * Mongoose schema for messages.
 * Defines the structure of a message document within the database, including references to the sender and receiver users,
 * the content of the message, a flag indicating if the message consists only of emojis, an array of emojis with their positions,
 * a timestamp, and the conversation ID to which the message belongs.
 *
 * @module Message
 * @typedef {Object} Message
 * @property {mongoose.Schema.Types.ObjectId} sender - The ID of the user who sent the message. Required.
 * @property {mongoose.Schema.Types.ObjectId} receiver - The ID of the user who is the intended recipient of the message. Required.
 * @property {string} content - The textual content of the message. Not required.
 * @property {boolean} justEmojis - A flag indicating whether the message consists solely of emojis. Required.
 * @property {Array<Object>} emojis - An array of objects representing emojis within the message, each with an emoji character and its index.
 * @property {string} timestamp - The timestamp when the message was sent. Required.
 * @property {mongoose.Schema.Types.ObjectId} conversationId - The ID of the conversation this message belongs to. Required but has a typo in 'required'.
 */
const schema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: false,
  },
  justEmojis: {
    type: Boolean,
    required: true
  },
  emojis: [{
    emoji: { type: String },
    index: { type: Number }
  }],
  timestamp: {
    type: String,
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Conversation',
    requried: true
  }
})

module.exports = mongoose.model('Message', schema)
const mongoose = require('mongoose')


/**
 * Mongoose schema for conversations.
 * Defines the structure of a conversation document within the database, including references to the participants and messages involved,
 * as well as an encryption key for securing the conversation content.
 *
 * @module Conversation
 * @typedef {Object} Conversation
 * @property {Array<mongoose.Schema.Types.ObjectId>} participants - An array of user IDs representing the participants of the conversation.
 * @property {Array<mongoose.Schema.Types.ObjectId>} messages - An array of message IDs representing the messages exchanged in the conversation.
 * @property {string} encryptionKey - A string used as an encryption key for the conversation's messages. Required for each conversation.
 */
const schema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  messages: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
  ],
  encryptionKey: { type: String, required: true }
})

module.exports = mongoose.model('Conversation', schema)
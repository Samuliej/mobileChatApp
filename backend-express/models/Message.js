const mongoose = require('mongoose')

/*

  Mongoose Schema for a single message.
  The message contains the sender and the receiver of the message,
  content, timestamp and the conversationId that the message belongs to.

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
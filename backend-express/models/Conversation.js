const mongoose = require('mongoose')

/*

  Mongoose Schema for a single conversation, there can be 2 or more participants,
  and the conversation contains the messages sent by the other user(s).

*/

const schema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  messages: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
  ],
})

module.exports = mongoose.model('Conversation', schema)
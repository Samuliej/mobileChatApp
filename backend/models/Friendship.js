const mongoose = require('mongoose')

const friendshipSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'ACCEPTED', 'DECLINED']
  }
})

module.exports = mongoose.model('Friendship', friendshipSchema)
const mongoose = require('mongoose')

const friendshipSchema = new mongoose.Schema({
  userA: {
    type: String,
    required: true
  },
  userB: {
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
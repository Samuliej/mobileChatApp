const mongoose = require('mongoose')

const friendshipSchema = new mongoose.Schema({
  userA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'ACCEPTED', 'DECLINED']
  }
})

module.exports = mongoose.model('Friendship', friendshipSchema)
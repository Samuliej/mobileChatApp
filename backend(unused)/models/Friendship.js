const mongoose = require('mongoose')

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
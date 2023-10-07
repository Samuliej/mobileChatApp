const mongoose = require('mongoose')

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
    required: true,
    minlength: 1
  },
  timestamp: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Message', schema)
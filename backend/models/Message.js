const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
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
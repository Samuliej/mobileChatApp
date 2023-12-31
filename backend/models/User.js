const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  phone: {
    type: String,
    required: false,
    minlength: 5
  },
  city: {
    type: String,
    required: false,
    minlength: 3
  },
  pendingFriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Friendship' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]

})

module.exports = mongoose.model('User', schema)
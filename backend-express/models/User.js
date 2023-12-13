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
  profilePicture: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  phone: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  pendingFriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Friendship' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }]

})

module.exports = mongoose.model('User', schema)
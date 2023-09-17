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
  }
})

module.exports = mongoose.model('User', schema)
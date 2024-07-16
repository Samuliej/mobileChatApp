require('dotenv').config()

/*

  This file contains necessary variables that are created from the env

*/

let PORT = process.env.PORT
let WS_PORT = process.env.WS_PORT
let MONGODB_URI = process.env.MONGODB_URI
let JWT_SECRET = process.env.JWT_SECRET
let NODE_ENV = process.env.NODE_ENV
let MONGODB_TEST_URI = process.env.MONGODB_TEST_URI

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  NODE_ENV,
  MONGODB_TEST_URI,
  WS_PORT,
}
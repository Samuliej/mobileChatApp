const crypto = require('crypto')
const key = crypto.randomBytes(32).toString('hex')

/*

  Middle ware for encrypting and decrypting messages

*/

const encryptMessage = (message, key) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
  let encrypted = cipher.update(message)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

const decryptMessage = (encryptedMessage, key) => {
  let parts = encryptedMessage.split(':')
  let iv = Buffer.from(parts.shift(), 'hex')
  let encryptedText = Buffer.from(parts.join(':'), 'hex')
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

module.exports = {
  key,
  encryptMessage,
  decryptMessage
}
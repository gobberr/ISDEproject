const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  googleId: String,                    
  access_token: String,
  refresh_token: String,    
  scope: String,    
  token_type: String,
  expiry_date: String,    
});

const Token = mongoose.model('token', tokenSchema);

module.exports = Token;
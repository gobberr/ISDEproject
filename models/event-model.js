const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  googleId: String, 
  title: String,
  date: String,
  start_time: String,
  end_time: String
});

const Event = mongoose.model('events', eventSchema);

module.exports = Event;
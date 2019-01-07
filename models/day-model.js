const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const daySchema = new Schema({
  // field to identify user and day
  googleId: String,
  date: String,
  // slot object
  slot_day: [{
    start_slot: String,
    end_slot: String,
    event: String,    
    freeRooms: [String]
  }]
});

const Day = mongoose.model('day-events', daySchema);

module.exports = Day;
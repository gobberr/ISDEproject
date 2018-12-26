const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventsSchema = new Schema({
    listEvents: Array 
});

const Events = mongoose.model('events', eventsSchema);

module.exports = Events;
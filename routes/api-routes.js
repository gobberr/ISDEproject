const express = require('express');
const router = express.Router();
const unitn = require('../public/javascripts/unitn-service');
const calendar = require('../public/javascripts/calendar-service');
const time = require('../public/javascripts/time-service');
const Events = require('../models/event-model');

router.get('/unitn', function(req, res, next) {
  // get all free room of povo
  unitn.easyroomRequest()
    .then((obj) => {
      let rooms = unitn.createRoomsObject(obj.data);      
      let freeRooms = unitn.getFreeRooms(rooms);
      res.render('unitn', { user: req.user, aule: freeRooms });    
    })
});

router.get('/select-calendar', function (req, res, next) {
    

  if(JSON.stringify(req.query.id)) { 
    // initialize calendar saving all events found
    calendar.init(JSON.stringify(req.query.id).substr(1, JSON.stringify(req.query.id).length -2), req.user.googleId)    
    res.render('select-calendar', { user: req.user, info: 'You have choose the calendar \'' + req.query.id + '\'', button: true })      
  
  } else {
    // remove all events in database
    Events.deleteMany({}, function(err, events) {            
      res.render('select-calendar', { user: req.user })  
    });
  }
});

router.get('/calendar', function(req, res, next) {
  // retrieve all events in database
  Events.find({}, function(err, events) {
    res.render('calendar', { user: req.user, events: events });  
  });
  
});

router.get('/run-demo', function(req, res, next) {
  
  unitn.easyroomRequest()
    .then((obj) => {
      let rooms = unitn.createRoomsObject(obj.data);      
      let freeRooms = unitn.getFreeRooms(rooms);
      Events.find({}, function(err, events) {
        let planning = time.merge(freeRooms, events)  
        res.render('run-demo', { user: req.user, planning: planning });
      });      
    })  
});

module.exports = router;
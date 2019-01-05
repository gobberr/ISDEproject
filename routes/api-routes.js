const express = require('express');
const router = express.Router();
const unitn = require('../public/javascripts/unitn-service');
const calendar = require('../public/javascripts/calendar-service');
const time = require('../public/javascripts/time-service');
const maintenance = require('../public/javascripts/maintenance-service');
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
  // if is logged
  if(true) { // FIXME: check req.user if is logged
    // if the calendar is already selected
    let id = '111505499228238424686'; // FIXME: get id from req.user.googleId
    if(JSON.stringify(req.query.id)) { 
      // initialize calendar saving all events found
      calendar.init(JSON.stringify(req.query.id).substr(1, JSON.stringify(req.query.id).length -2), id /*req.user.googleId*/)    
      res.render('select-calendar', { user: req.user, info: 'You have choose the calendar \'' + req.query.id + '\'', button: true })      
    
    } else {
      // before select calendar, remove all events in database in order to clean the envoirment
      // console.log(req.user)
      Events.deleteMany({ googleId: id/*req.user.googleId*/ }, function(err, events) {            
        res.render('select-calendar', { user: req.user })  
      });
    }
  } else {
    res.render('select-calendar', { user: req.user })  
  }
});

router.get('/calendar', function(req, res, next) {
  // retrieve all events in database
    Events.find( { googleId: req.user.googleId } , function(err, events) {
      res.render('calendar', { user: req.user, events: events });  
    });  
});

router.get('/run-demo', function(req, res, next) {
  // if is logged
  if (req.user) {
    // get free rooms and events, merge it and print the result  
    unitn.easyroomRequest()
    .then((obj) => {
      let rooms = unitn.createRoomsObject(obj.data);      
      let freeRooms = unitn.getFreeRooms(rooms);
      Events.find({ googleId: req.user.googleId }, function(err, events) {
        let planning = time.merge(freeRooms, events)  
        res.render('run-demo', { user: req.user, planning: planning });
      });      
    })  
  } else {
    res.render('run-demo', { user: req.user });
  }
});

router.get('/maintenance', function(req, res, next) {
  
  //print a new token
  let newToken = maintenance.getAccessToken();
  res.render('maintenance', { user: req.user, token: newToken });
  
});

module.exports = router;
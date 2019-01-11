const express = require('express');
const router = express.Router();
const unitn = require('../public/javascripts/unitn-service');
const calendar = require('../public/javascripts/calendar-service');
const time = require('../public/javascripts/time-service');
const maintenance = require('../public/javascripts/maintenance-service');
const db = require('../public/javascripts/database-service');
const Events = require('../models/event-model');
const Day = require('../models/day-model');

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
  if(req.user) { 
    // if the calendar is already selected    
    if(JSON.stringify(req.query.id)) { 
      // initialize calendar saving all events found
      calendar.init(JSON.stringify(req.query.id).substr(1, JSON.stringify(req.query.id).length -2), /*id*/ req.user.googleId)    
      res.render('select-calendar', { user: req.user, info: 'You have choose the calendar \'' + req.query.id + '\'', button: true })      
    
    } else {
      // before select calendar, remove all events in database in order to clean the envoirment
      // console.log(req.user)
      Events.deleteMany({ googleId: req.user.googleId }, function(err, events) {            
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
      if(err) console.log('Error retrieving data from mongo')
      res.render('calendar', { user: req.user, events: events });  
    });  
});

//create a new token for new user
router.get('/maintenance', function(req, res, next) {    
  let newToken = maintenance.getAccessToken();
  res.render('maintenance', { user: req.user, token: newToken });
});

router.get('/run-demo', function(req, res, next) {
  console.log('run-demo')
  // if is logged
  if (req.user) {        
    res.render('run-demo', { user: req.user, clean: true, instruction: true, procedure: true });    
  }
});

// clean the db
router.get('/run-demo/clean', function(req, res, next) { 
  console.log('clean the db')
  db.deleteMergedDay(req.user.googleId);
  res.render('run-demo', { user: req.user, merge: true, procedure: true });
});

// write merged day in db
router.get('/run-demo/set', function(req, res, next) { 
  console.log('set data in db') 
  
  // get free rooms and events, merge it and print the result  
  unitn.easyroomRequest()
  .then((obj) => {
    let rooms = unitn.createRoomsObject(obj.data);      
    let freeRooms = unitn.getFreeRooms(rooms);
    Events.find({ googleId: req.user.googleId }, function(err, events) {
      if(err) console.log('no events stored in db')
      time.merge(freeRooms, events, req.user.googleId) 
      res.render('run-demo', { user: req.user, get: true, procedure: true });
    });
  });
});

// query here from db
router.get('/run-demo/result', function(req, res, next) { 
  console.log('get data from db')  
  let currentDate = time.getCurrentDate();
  Day.find({ googleId: req.user.googleId, date: currentDate }, function(err, events) {
    if(err) console.error(err)
    res.render('run-demo', { user: req.user, result: true, planning: events });
  })
});



module.exports = router;
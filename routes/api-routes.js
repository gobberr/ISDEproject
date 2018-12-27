const express = require('express');
const router = express.Router();
const unitn = require('../public/javascripts/unitn-service');
const calendar = require('../public/javascripts/calendar-service');
const time = require('../public/javascripts/time-service')
const Events = require('../models/event-model');

router.get('/unitn', function(req, res, next) {
  
  unitn.HTTPrequestJSON()
    .then((obj) => {
      let rooms = unitn.createRoomsObject(obj.data);      
      let freeRooms = unitn.getFreeRooms(rooms);
      res.render('unitn', { user: req.user, aule: freeRooms });    
    })
});

router.get('/select-calendar', function (req, res, next) {
    
  if(JSON.stringify(req.query.id)) {    
    
    calendar.init(JSON.stringify(req.query.id).substr(1, JSON.stringify(req.query.id).length -2), req.user.googleId)
    
    res.render('select-calendar', { user: req.user, info: 'You have choose the calendar \'' + req.query.id + '\'', button: true })      
  
  } else {

    res.render('select-calendar', { user: req.user })  
  }
});



router.get('/calendar', function(req, res, next) {

  Events.find({}, function(err, events) {
    res.render('calendar', { user: req.user, events: events });  
  });
  
});

router.get('/maps', function(req, res, next) {
  
  res.render('maps', { user: req.user });
});

router.get('/facebook', function(req, res, next) {
  
  res.render('facebook', { user: req.user });
});

router.get('/test', function(req, res, next) {
  
  res.render('test', { user: req.user });
});

module.exports = router;
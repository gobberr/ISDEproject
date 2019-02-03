const express = require('express');
const router = express.Router();
const request = require('request');
const calendar = require('../public/javascripts/calendar-service');
const maintenance = require('../public/javascripts/maintenance-service');
const Events = require('../models/event-model');


router.get('/unitn', function(req, res, next) {
  
  // get all free room of povo
  request({
    uri: 'https://unitn-service.herokuapp.com',    
    method: 'GET',    
  }, function(error, response) {
      if (!error && response.statusCode === 200) {                
        res.render('unitn', { user: req.user, aule: JSON.parse(response.body) });          
      }
  })  
});

router.get('/select-calendar', function (req, res, next) { 
  // if is logged
  if(req.user) { 
    // if the calendar is already selected    
    if(JSON.stringify(req.query.id)) { 
      // initialize calendar saving all events found
      console.log(req.query.id)
      
      calendar.init(JSON.stringify(req.query.id).substr(1, JSON.stringify(req.query.id).length -2), req.user.googleId)    
      res.render('select-calendar', { user: req.user, info: 'You have choose the calendar \'' + req.query.id + '\'', button: true })      
    
    } else {
      // before select calendar, remove all events in database in order to clean the envoirment      
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

module.exports = router;
const express = require('express');
const router = express.Router();
const request = require('request');
const calendar = require('../public/javascripts/calendar-service');

// get all free room of povo
router.get('/unitn', function(req, res, next) {    
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
      calendar.init(JSON.stringify(req.query.id).substr(1, JSON.stringify(req.query.id).length -2), req.user.googleId)    
      res.render('select-calendar', { user: req.user, info: 'You have choose the calendar \'' + req.query.id + '\'', button: true })          
    } else {      
      // before select calendar, remove all events in database in order to clean the envoirment            
      request({
        uri: 'http://localhost:3002/delete-events',
        method: 'DELETE',
        json: {
          googleId: req.user.googleId
        }
      }, function(error, response) {
          if (!error && response.statusCode === 200) {                
            res.render('select-calendar', { user: req.user })  
          } else {
            console.log(error)
          }
      }) 
    }
  } else {
    res.render('select-calendar', { user: req.user })  
  }
});

router.get('/calendar', function(req, res, next) {
  // retrieve all events in database
  request({
    uri: 'http://localhost:3002/get-events',
    method: 'GET',
    json: {
      googleId: req.user.googleId
    }
  }, function(error, response) {    
    if (!error && response.statusCode === 200) {                     
      res.render('calendar', { user: req.user, events: response.body });
    } else {
      console.log(error)
    }
  }) 
});

module.exports = router;
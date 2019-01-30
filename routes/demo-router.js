const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('../public/javascripts/database-service');
const time = require('../public/javascripts/time-service');
const Day = require('../models/day-model');
const Events = require('../models/event-model');


router.get('/', function(req, res, next) {    
    // if is logged
    if (req.user) {        
      res.render('run-demo', { user: req.user, clean: true, instruction: true, procedure: true });    
    } else {
      res.render('select-calendar', { user: req.user })  
    }
  });
  
  // clean the db
  router.get('/clean', function(req, res, next) {     
    db.deleteMergedDay(req.user.googleId);
    res.render('run-demo', { user: req.user, merge: true, procedure: true });
  });
  
  // write merged day in db
  router.get('/set', function(req, res, next) {       
    
    request({
      uri: 'https://unitn-service.herokuapp.com/demo',    
      method: 'GET',    
    }, function(error, response) {
      if (!error && response.statusCode === 200) {                
        Events.find({ googleId: req.user.googleId }, function(err, events) {
          if(err) console.log('no events stored in db')
          time.mergeEvents(JSON.parse(response.body), events, req.user.googleId) 
          res.render('run-demo', { user: req.user, get: true, procedure: true });
        });
      } else {
        console.log('error')
      }
    });     
  });
  
  // query here from db
  router.get('/result', function(req, res, next) {     
    let currentDate = time.getCurrentDate();
    Day.find({ googleId: req.user.googleId, date: currentDate }, function(err, events) {
      if(err) console.error(err)
      res.render('run-demo', { user: req.user, result: true, planning: events });
    })
  });


module.exports = router;
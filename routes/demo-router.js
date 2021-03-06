const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', function(req, res, next) {    
    // if is logged
    if (req.user) {
      res.render('run-demo', { user: req.user, clean: true, instruction: true, procedure: true });    
    } else {
      res.render('run-demo', { user: req.user })  
    }
});

// clean the db 
router.get('/clean', function(req, res, next) { 

  request({
    uri: 'https://database-service-isde.herokuapp.com/delete-day',
    method: 'DELETE',
    json: {
      googleId: req.user.googleId
    }
  }, function(error, response) {
      if (!error && response.statusCode === 200) {                      
        res.render('run-demo', { user: req.user, merge: true, procedure: true });
      } else {
        console.log('error in /demo/clean')
      }
  })
});

// write merged day in db
router.get('/set', function(req, res, next) {       
  
  // get free room from unitn-service 
  request({
    uri: 'https://unitn-service.herokuapp.com/demo',    
    method: 'GET',    
  }, function(error, room) {

    // then set events retrieved from db and merge
    if (!error && room.statusCode === 200) {   

      request({
        uri: 'https://database-service-isde.herokuapp.com/get-events-list',
        method: 'GET',
        json: {
          googleId: req.user.googleId
        }
      }, function(error, events) {    
        if (!error && events.statusCode === 200) {          
          request({
            uri: 'https://database-service-isde.herokuapp.com/get-merge-events',
            method: 'GET',
            json: {
              googleId: req.user.googleId,
              room: room.body,
              events: events.body
            }
          }, function(error, result) {
            if(error || result.statusCode != 200) console.log('error in /demo/set')
            res.render('run-demo', { user: req.user, get: true, procedure: true });
          })
        }
      })
    }
  });     
});

// query here from db
router.get('/result', function(req, res, next) {   
  
  request({
    uri: 'https://database-service-isde.herokuapp.com/get-day',
    method: 'GET',
    json: {
      googleId: req.user.googleId
    }
  }, function(error, events) {    
    if (!error && events.statusCode === 200) {                           
      res.render('run-demo', { user: req.user, result: true, planning: events.body });
    } else {
      console.log('error on /get-day')
    }
  })
});

module.exports = router;
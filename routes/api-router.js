const express = require('express');
const router = express.Router();
const unitn = require('../public/javascripts/freeRoomUnitnService');
const calendar = require('../public/javascripts/googleCalendarService');

router.get('/auleUniTN', function(req, res, next) {
  
  unitn.HTTPrequestJSON()
    .then((obj) => {
      // console.log("\tLogDev: contain_event = " + JSON.stringify(obj.data));
      let rooms = unitn.createRoomsObject(obj.data);      
      // console.log("\tLogDev: rooms = " + JSON.stringify(rooms));
      let freeRooms = unitn.getFreeRooms(rooms);
      // console.log("\tLogDev: freeRooms = " + JSON.stringify(freeRooms));
      // console.log(JSON.stringify(common.initDay()));
      res.render('auleUniTN', { user: req.user, aule: freeRooms });    
    })
});

router.get('/calendar', function (req, res, next) {
    
  if(JSON.stringify(req.query.id)) {    
    // console.log(JSON.stringify(req.query))    
    calendar.init(JSON.stringify(req.query.id).substr(1, JSON.stringify(req.query.id).length -2));
    // calendar.init('primary');
    
    res.render('calendar', { user: req.user, info: 'Hai selezionato ' + req.query.id })  
  } else {
    res.render('calendar', { user: req.user })
  }  
});

router.get('/calendarApi', function(req, res, next) {

  let ris = calendar.getEventsToday();
  // console.log("ris: " + JSON.stringify(ris))  
  res.render('calendarApi', { user: req.user, events: ris });
});

router.get('/maps', function(req, res, next) {
  
  res.render('maps', { user: req.user });
});

router.get('/facebookEvents', function(req, res, next) {
  
  res.render('facebookEvents', { user: req.user });
});

router.get('/test', function(req, res, next) {
  
  res.render('test', { user: req.user });
});

module.exports = router;
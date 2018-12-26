const express = require('express');
const router = express.Router();
const unitn = require('../public/javascripts/freeRoomUnitnService');
const calendar = require('../public/javascripts/googleCalendarService');
const common = require('../public/javascripts/timeService');

router.get('/auleUniTN', function(req, res, next) {
  
  // http request
  unitn.HTTPrequestJSON()
    .then((obj) => {
              
      // console.log("\tLogDev: contain_event = " + JSON.stringify(obj.data));
      let rooms = unitn.createRoomsObject(obj.data);      
      // console.log("\tLogDev: rooms = " + JSON.stringify(rooms));
      let freeRooms = unitn.getFreeRooms(rooms);
      // console.log("\tLogDev: freeRooms = " + JSON.stringify(freeRooms));
      // Once we have all the required data, we can print it in the html            
      // Render the data to the pug      
      // console.log(JSON.stringify(common.initDay()));

      if(!freeRooms.length) {
        freeRooms = ['Nessun aula libera trovata'];
      }
      res.render('auleUniTN', { user: req.user, title: 'List of room in UniTN', aule: freeRooms  });
    
    })
    .catch((err) => {
      // In case of error, log and send the error to the client
      res.locals.message = err.message;
      res.locals.err = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);  
      res.render('error', { error : err} );
    });
});

router.get('/calendar', function (req, res, next) {
    
  if(JSON.stringify(req.query.id)) {    
    // console.log(JSON.stringify(req.query))
    calendar.init(JSON.stringify(req.query.id).substr(1, JSON.stringify(req.query.id).length -2));
    // calendar.init('primary');
    res.render('calendar', { user: req.user, title: 'Calendar API', info: 'Hai selezionato ' + req.query.id, submit: '' })  

  } else {
    res.render('calendar', { user: req.user, title: 'Calendar API', info: '', submit: 'Prosegui' })  
  }   
  
});

router.get('/calendarApi', function(req, res, next) {
  let ris = calendar.getEventsToday();
  console.log("ris: " + JSON.stringify(ris))
  res.render('calendarApi', { user: req.user, events: ris });
});

router.get('/maps', function(req, res, next) {
  
  res.render('maps', { user: req.user, title: 'Nothing to see here...' });
});

router.get('/facebookEvents', function(req, res, next) {
  
  res.render('facebookEvents', { user: req.user, title: 'Nothing to see here...' });
});

router.get('/test', function(req, res, next) {
  
  res.render('test', { user: req.user, title: 'Testing' , result: 'Result'});
});

module.exports = router;
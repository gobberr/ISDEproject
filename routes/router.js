let express = require('express');
let router = express.Router();
const unitn = require('./../public/javascripts/freeRoomUnitnService');
const calendar = require('./../public/javascripts/googleCalendarService');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Homepage'});
});

router.get('/auleUniTN', function(req, res, next) {
  
  // http request
  unitn.HTTPrequestJSON()
    .then((obj) => {
              
      // console.log("\tLogDev: contain_event = " + JSON.stringify(obj.data));
      let rooms = unitn.createRoomsObject(obj.data);      
      // console.log("\tLogDev: rooms = " + JSON.stringify(rooms));
      // Once the room array created, compute the currently free rooms and the next lecture's schedule
      let freeRooms = unitn.getFreeRooms(rooms);
      // console.log("\tLogDev: freeRooms = " + JSON.stringify(freeRooms));
      // Once we have all the required data, we can print it in the html            
      // Render the data to the pug
      if(!freeRooms.length) {
        freeRooms = ['Nessun aula libera trovata'];
      }
      res.render('auleUniTN', { title: 'List of room in UniTN', aule: freeRooms });
    
    })
    .catch((err) => {
      // In case of error, log and send the error to the client
      res.locals.message = err.message;
      res.locals.err = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);  
      res.render('error', { error : err} );
    });
});

router.get('/selectCalendar', function (req, res, next) {
  
  let thisMessage = '';  
  if(req.query.calendar) {
    thisMessage = "Hai selezionato " + req.query.calendar;
  }    
  res.render('selectCalendar', { title: 'Insert the name of the calendar', info: thisMessage })  
});

router.get('/calendar/:calendarId', function(req, res, next) {
  
  calendar.init(req.params.calendarId)
  //.then((listEvents) => {
  let listEvent = calendar.getEventsToday();
  res.render('calendar', { title: 'List of events in your calendar', events : listEvent, idCalendar: req.params.calendarId })     
  /*}).catch((err) => {
    // In case of error, log and send the error to the client
    res.locals.message = err.message;
    res.locals.err = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);      
    res.render('error', { error : err} );
  });*/ 

});

router.get('/test', function(req, res, next) {
  let ris = calendar.getEventsToday();
  res.render('test', { result: JSON.stringify(ris) });
});

module.exports = router;
let express = require('express');
let router = express.Router();
const unitn = require('./../public/javascripts/freeRoomUnitnService');
const calendar = require('./../public/javascripts/googleCalendarService');
const {google} = require('googleapis');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homepage' });
});

router.get('/auleUniTN', function(req, res, next) {
  
  // http request
  unitn.HTTPrequestJSON()
    .then((obj) => {
              
      //console.log("\tLogDev: contain_event = " + JSON.stringify(obj.data));
      var rooms = unitn.createRoomsObject(obj.data);      
      // console.log("\tLogDev: rooms = " + JSON.stringify(rooms));
      // Once the room array created, compute the currently free rooms and the next lecture's schedule
      var freeRooms = unitn.getFreeRooms(rooms);
      //console.log("\tLogDev: freeRooms = " + JSON.stringify(freeRooms));
      // Once we have all the required data, we can print it in the html      
      // var data = JSON.stringify(freeRooms);
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

/*router.get('/calendar', function (req, res, next) {
  res.render('selectCalendar', { title: 'Insert the name of the calendar' })   
});*/

router.get('/calendar/:calendarId', async (req, res, next) => {
  
  
  //console.log(req.params.calendarId);
  console.log("1")
  await calendar.init(req.params.calendarId)
  console.log("2")
  let listEvents = calendar.getEventToday()
  //.then((listEvents) => {
    
    console.log('3 listEvents: <' + JSON.stringify(listEvents) + '>')  
    res.render('calendar', { title: 'List of events in your calendar', events : listEvents })   
    console.log("4")
    calendar.resetEventToday();
    console.log('5 listEvents: <' + JSON.stringify(listEvents) + '>')  
    

    calendar.resetEventToday();
    console.log('6')  
    console.log('7 ' + calendar.getEventToday());
    console.log('8')
    
    let auth = google.auth;
    console.log('9 ' + JSON.stringify(auth));    

  /*}).catch((err) => {
    // In case of error, log and send the error to the client
    res.locals.message = err.message;
    res.locals.err = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);      
    res.render('error', { error : err} );
  });*/ 

});


module.exports = router;

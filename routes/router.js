let express = require('express');
let router = express.Router();
const calendar = require('./../public/javascripts/googleCalendarService');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Homepage' });
});

router.get('/calendar', function(req, res, next) {
  calendar.init('primary')
  /*.then((resultInitialization) => {
  
  }).catch((err) => {
    // In case of error, log and send the error to the client
    res.locals.message = err.message;
    res.locals.err = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);      
    res.render('error', { error : err} );
  });
  */
  let listEvents = calendar.getEventToday(); //TODO: implement this function
  //listEvents.push('ciao')
  console.log('listEvents: <' + listEvents + '>')  
  res.render('calendar', { title: 'List of events in your calendar', events : listEvents })   
    
});


module.exports = router;

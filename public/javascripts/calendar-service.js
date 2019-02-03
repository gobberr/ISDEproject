const {google} = require('googleapis');
const time = require('./time-service');
const keys = require('../../config/keys');
const Token = require('../../models/token-model');
const Events = require('../../models/event-model');

/**
 * Initialize the calendar flow, setting callback and other stuff used for access to calendar
 * @param {*} idCalendar Name of the calendar in google calendar
 * @param {*} googleIdReq Google id of the account to get access to his calendar
 */
function init(idCalendar, googleIdReq) {
  
  // Authorize a client with credentials then call saveEvents() to store events in mongodb
  authorize(saveEvents, idCalendar, googleIdReq);
  return 0;
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @param {String} googleIdReq Google id of the account to get access to his calendar
 */
function authorize(callback, calendarId, googleIdReq) {
  
  const oAuth2Client = new google.auth.OAuth2(
      keys.google_calendar.clientID, keys.google_calendar.clientSecret, 'urn:ietf:wg:oauth:2.0:oob');
  
  // find token record stored previously in mongo
  //TODO: get token
  Token.findOne({
    googleId: googleIdReq
  }).then((currentToken) => { 

    // cast the object stored in mongodb to the format accepted by setCredentials function
    let token = new Object();
    token.access_token = currentToken.access_token;
    token.refresh_token = currentToken.refresh_token;
    token.scope = currentToken.scope;
    token.token_type = currentToken.token_type;
    token.expiry_date = Number(currentToken.expiry_date);
    oAuth2Client.setCredentials(token);    
        
    callback(oAuth2Client, calendarId, googleIdReq);
    
  }).catch((err) => {
    console.log(err)
  });
}

/**
 * Lists the events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function saveEvents(auth, idCalendar, googleIdReq) {
  
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: idCalendar,
    timeMin: (new Date()).toISOString(),    
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) {
      return console.error('Error loading calendar: ' + idCalendar + '. Error: ' + err);
    }
    else {
      const events = res.data.items;
    
      // if there are some elements in the calendar
      if (events.length) {       
        let current_date_format = time.getCurrentDate()        
        // scan all events finded in the calendar
        events.forEach(event => {
          
          // if the event is today, put it in the eventToday array
          if(current_date_format === event.start.dateTime.substring(0, 10)) {              
            
            // TODO: get single events
            Events.findOne({
              googleId: googleIdReq,
              title: event.summary,
              date: event.start.dateTime.substring(0, 10),
              start_time: event.start.dateTime.substring(11, 16),
              end_time: event.end.dateTime.substring(11, 16)
            }).then((currentEvents) => {
              if(currentEvents) {                
                  // console.log('Evento già presente: ' + currentEvents);                  
              } else {
                // create a new record for token and save it

                // TODO: create new events
                new Events({
                  googleId: googleIdReq,
                  title: event.summary,
                  date: event.start.dateTime.substring(0, 10),
                  start_time: event.start.dateTime.substring(11, 16),
                  end_time: event.end.dateTime.substring(11, 16)
                }).save(); 
              }
            })   
          }
        });        
      } else {
        // console.error('There are no events in the calendar: ' + idCalendar);
      }
    }
  });    
}

exports.init = init;
const {google} = require('googleapis');
const keys = require('../../config/keys');
const request = require('request');

/**
 * Initialize the calendar flow, setting callback and other stuff used for access to calendar
 * @param {*} idCalendar Name of the calendar in google calendar
 * @param {*} googleIdReq Google id of the account to get access to his calendar
 */
function init(idCalendar, googleIdReq) {  
  // Authorize a client with credentials then call saveEvents() to store events in mongodb
  authorize(saveEvents, idCalendar, googleIdReq);  
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
  request({
    uri: 'http://localhost:3002/get-token',
    method: 'GET',
    json: {
      googleId: googleIdReq
    }
  }, function(error, response) {
    if (!error && response.statusCode === 200) {    
      
      // cast the object stored in mongodb to the format accepted by setCredentials function
      let token = new Object();
      let currentToken = new Object()
      currentToken = response.body;      
      token.access_token = currentToken.access_token;
      token.refresh_token = currentToken.refresh_token;
      token.scope = currentToken.scope;
      token.token_type = currentToken.token_type;
      token.expiry_date = Number(currentToken.expiry_date);
      oAuth2Client.setCredentials(token);    
      
      callback(oAuth2Client, calendarId, googleIdReq);      
    } 
  })
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
    
    if (err) return console.log('Error loading calendar: ' + idCalendar + '. Error: ' + err);    
    const events = res.data.items;    
    // if there are no elements in the calendar
    if (events.length==0) return console.log('No events in calendar: ' + idCalendar);            
    let current_date_format = getCurrentDate()            
    // scan all events finded in the calendar
    events.forEach(event => {      
      // if the event is today, put it in the eventToday array
      if(current_date_format === event.start.dateTime.substring(0, 10)) {              
        request({
          uri: 'http://localhost:3002/put-event',
          method: 'PUT',
          json: {
            event: {
              googleId: googleIdReq,
              title: event.summary,
              date: event.start.dateTime.substring(0, 10),
              start_time: event.start.dateTime.substring(11, 16),
              end_time: event.end.dateTime.substring(11, 16)
            }
          }
        })            
      }
    });                
  });    
}

/**
 * Return the current date 
 */
function getCurrentDate() {  
  let current_date = new Date();      
  let d = new Date(current_date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

exports.init = init;
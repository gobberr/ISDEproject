const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
let path = require('path');

let eventToday = [];

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(__dirname, '/calendarService/token.json');

function init(idCalendar) {
  // Load client secrets from a local file.
  //fs.readFile('calendarService/credentials.json', (err, content) => {
  fs.readFile(path.join(__dirname, '/calendarService/credentials.json'), (err, content) => {
    if (err) return console.error('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents, idCalendar);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, calendarId) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, calendarId);
  }); 
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, idCalendar) {
  
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: idCalendar,
    timeMin: (new Date()).toISOString(),    
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) {
      // return console.error('Error: ' + err);
    }
    else {
      const events = res.data.items;
        
      // if there are some elements in the calendar
      if (events.length) {       
        let current_date_format = getCurrentDate()
        
        // scan all events finded in the calendar
        events.forEach(event => {
          //console.log('event in date: ' + event.start.dateTime.substring(0, 10));  

          // if the event is today, put it in the eventToday array
          if(current_date_format === event.start.dateTime.substring(0, 10)) {       
            // console.log('match for event ' + event.summary)
            eventToday.push(event)
          }
        });
        // console.log('eventToday = ' + JSON.stringify(eventToday[0].summary));
        return eventToday;        
      } else {
        console.error('There aren\'t any events in this calendar');
      }    
    } 
  }); 
    
}

function getEventToday() {
    return eventToday;
}

function getCurrentDate() {

    var current_date = new Date();      
    var d = new Date(current_date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

exports.init = init;
exports.getEventToday = getEventToday; 
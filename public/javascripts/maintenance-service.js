const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const keys = require('../../config/keys');

/* 
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken() {
  
  const oAuth2Client = new google.auth.OAuth2(
    keys.google_calendar.clientID, keys.google_calendar.clientSecret, 'urn:ietf:wg:oauth:2.0:oob');

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar',
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) 
        return console.error('Error retrieving access token', err);
      
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      const TOKEN_PATH = '/../../config/'
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);  
        console.log('Token')
        console.log(JSON.stringify(token));
        console.log('Token stored to', TOKEN_PATH);
      });      
    });
  });  
}

exports.getAccessToken = getAccessToken;
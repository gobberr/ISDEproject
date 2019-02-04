const passport  = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');
const Token = require('../models/token-model');

passport.serializeUser((user,done) => {
  done(null,user.id);
});

passport.deserializeUser((id,done) => {  
  User.findById(id).then((user) => {
    done(null,user);
  })
});

passport.use(
  new GoogleStrategy({
    //options for the strategy
    callbackURL:'/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (accessToken,refreshToken,profile,done) => {    
    //check if user exists in database     
    User.findOne({
      googleId: profile.id
    }).then((currentUser) => {
      if(currentUser) {
        //already have user        
        done(null, currentUser);
      } else {
        //create new user and save it        
        new User({
          username: profile.displayName,
          provider: 'google',                    
          googleId: profile.id,                    
          email: profile.emails[0].value,                    
        }).save().then((newUser) => {          
          done(null, newUser);
        })     
      }
    });
    // check if token exists in database
    Token.findOne({
      googleId: profile.id
    }).then((currentToken) => {
      if(currentToken) {                        
        done(null, currentToken);
      } else {
        // create a new record for token and save it        
        new Token({
          googleId: profile.id,
          access_token: accessToken,
          refresh_token: '1/ljF6aZakph6PcMmLD4fmulgk9FcSUKhFr_koesY0J-7Ott3N0oRkw2AVSzFKCv7b',    
          scope: 'https://www.googleapis.com/auth/calendar',    
          token_type: 'Bearer',
          expiry_date: '1645480906667', //default '1545480906667'    
        }).save().then((newToken) => {          
          done(null, newToken)
        })
      }
    })
  })
);
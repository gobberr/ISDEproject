const passport  = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    })
});


passport.use(
    new GoogleStrategy({
        //options for the strategy
        callbackURL:'/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    },(accessToken,refreshToken,profile,done)=>{
        //passport callback function
        //check if user exists in database
        //console.dir(profile,{depth: 3,colors: true});
        User.findOne({
            googleId: profile.id
        }).then((currentUser)=>{
            if(currentUser){
                //already have user
                //console.log('user is: ' + currentUser);
                done(null, currentUser);
            }else{
                //create new user and save it
                new User({
                    username: profile.displayName,
                    provider: 'google',                    
                    googleId: profile.id,                    
                    email: profile.emails[0].value,                    
                }).save().then((newUser)=>{
                    //console.log('new user created: ' + newUser);
                    done(null, newUser);
                })     
            }
        });
    })
);
/*
passport.use(
    new GithubStrategy({
        //options for the strategy
        callbackURL:'/auth/github/redirect',
        clientID: keys.github.clientID,
        clientSecret:keys.github.clientSecret
    },(accessToken,refreshToken,profile,done)=>{
        //passport callback function
        //check if user exists in database
        //console.log(profile);
        //console.dir(profile,{depth: 3,colors: true});
        User.findOne({
            githubId: profile.id
        }).then((currentUser)=>{
            if(currentUser){
                //already have user
                //console.log('user is: ' + currentUser);
                done(null, currentUser);
            }else{
                //create new user and save it
                new User({
                    username: profile.displayName,
                    provider: 'github',
                    githubId: profile.id,
                    googleId: '',
                    facebookId: '',
                    email: profile.emails[0].value,
                    thumbnail: profile.photos[0].value
                }).save().then((newUser)=>{
                    //console.log('new user created: ' + newUser);
                    done(null, newUser);
                })     
            }
        });
    })
);

passport.use(
    new FacebookStrategy({
        //options for the strategy
        callbackURL:'/auth/facebook/redirect',
        clientID: keys.facebook.clientID,
        clientSecret:keys.facebook.clientSecret,
        profileFields: ['id', 'emails', 'displayName','picture.type(large)']
    },(accessToken,refreshToken,profile,done)=>{
        //passport callback function
        //check if user exists in database
        //console.log(profile);
        //console.dir(profile,{depth: 3,colors: true});
        User.findOne({
            facebookId: profile.id
        }).then((currentUser)=>{
            if(currentUser){
                //already have user
                //console.log('user is: ' + currentUser);
                done(null, currentUser);
            }else{
                //create new user and save it
                new User({
                    username: profile.displayName,
                    provider: 'facebook',
                    githubId: '',
                    googleId: '',
                    facebookId: profile.id,
                    email: profile.emails[0].value,
                    thumbnail: profile.photos ? profile.photos[0].value : 'https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=6&m=476085198&s=612x612&w=0&h=5cDQxXHFzgyz8qYeBQu2gCZq1_TN0z40e_8ayzne0X0='
                }).save().then((newUser)=>{
                    //console.log('new user created: ' + newUser);
                    done(null, newUser);
                })     
            }
        });
    })
);*/
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const logger = require('morgan');

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const apiRouter = require('./routes/api-routes');

const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');
const passportSetup = require('./config/passport-setup');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  maxAge: 24*60*60*1000, // in milliseconds
  keys:[keys.session.cookieKey] // key to encrypt data in the cookie
}));

//initialaze passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect(keys.mongoDB.dbURI, { useNewUrlParser: true }, () => {
  // console.log('Connected to mongodb');
})

//set up routes
app.use('/api', apiRouter);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

/* GET home page. */
app.get('/', function(req, res, next) {
  
  res.render('homepage', { user: req.user });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

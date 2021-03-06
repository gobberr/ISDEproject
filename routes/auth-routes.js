const router = require('express').Router();
const passport  = require('passport');
const express = require('express');
const path = require('path');

//static files such as css or html
router.use(express.static(path.join(__dirname, '../public')));

//auth logout
router.get('/logout', (req, res) => {
  //handle with passport
  req.logout();
  res.redirect('/');
});

//auth google
router.get('/google', passport.authenticate('google', {
  scope:['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}));

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {  
  res.redirect('/profile');
});

module.exports = router;
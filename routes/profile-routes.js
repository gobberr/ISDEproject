const router = require('express').Router();
const express = require('express');
const path = require('path');

//static files such as css or html
router.use(express.static(path.join(__dirname, '../public')));

const authCheck = (req, res, next) => {
  if(!req.user) {
    res.redirect('/auth/login');
  } else {
    next();
  }
}

router.get('/', authCheck, (req,res) => {
  res.render('profile', { user: req.user, title: 'Profile' });    
})

module.exports = router;
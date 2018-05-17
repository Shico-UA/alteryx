const express = require("express");
const router  = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Utils = require('../utils');

let userID = 1;

router.get('/', (req, res) => {
  res.send('Main Page');
});

router.get('/register', Utils.logout, (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  let formData = Object.assign({}, req.body);
  let users = Utils.loadUserJSON();

  let exist = Utils.checkUserExistenceByEmail(formData, users);
  if (exist) {
    res.render('register_error', { userEmail: formData.email });
  } else {
    formData.id = userID.toString();
    users.push(formData);
    userID++;
    //Save new user into JSON file.
    Utils.writeUserJson(users);
    console.info(`User ${formData.firstName} successfuly registered!`)
    res.redirect('/');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  let formData = req.body;
  let users = Utils.loadUserJSON();
  let granted = Utils.checkUserCredentials(formData, users);
  if (granted) {
    jwt.sign(formData.email, "secretWord", function(err, token) {
      res.cookie('auth', token);
      console.info('Login successful!');
      res.redirect('/');
    });
  } else {
    console.info(`User with such email or password does not exists!`);
    res.redirect('/register');
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("auth");
  console.info('You are logged out!');
  res.redirect('/');
});

module.exports = router;

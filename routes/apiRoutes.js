const express = require("express");
const router  = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Utils = require('../utils');

router.get('/users', Utils.verifyToken, (req, res) => {
  try {
    let users = Utils.loadUserJSON();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.send('No data available.');
  };
});

router.get('/users/:id', Utils.verifyToken, (req, res) => {
  let users = Utils.loadUserJSON();
  let user = Utils.checkUserExistenceByID(req.params, users);
    if (user) {
      res.json(user);
    } else {
      res.send('User with such ID was not found.');
    }
});

router.put('/users/:id', Utils.verifyToken, (req, res) => {
  let formData = req.body;
  let users = Utils.loadUserJSON();
  let user = Utils.checkUserExistenceByID(req.params, users);
  
  //Update logic
  for (const key in formData) {
    if (formData.hasOwnProperty(key) && user.hasOwnProperty(key)) {
      user[key] = formData[key];
    }
  }

  //Save updated users object
  Utils.writeUserJson(users);
  res.send('User was updated!');
});

router.delete('/users/:id', Utils.verifyToken, (req, res) => {
  let users = Utils.loadUserJSON();
  let user = Utils.checkUserExistenceByID(req.params, users);

  //Delete logic
  users = users.filter(user => user.id !== req.params.id);
  
  //Save updated users object
  Utils.writeUserJson(users);
  res.send('User deleted!');
});

module.exports = router;

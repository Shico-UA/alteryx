const express = require("express");
const router  = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');

// let User;
let userID = 1;

let loadUserJSON = () => {
  let Users;
  try {
    Users = JSON.parse(fs.readFileSync(__dirname + '/../User.json', 'utf8'));
    return Users;
  } catch (error) {
    console.info('No User file detected.');
    return {};
  };
}

//Save new User and check user existence.
let saveUserData = (reqObj, resObj) => {
  let userObj = Object.assign({}, reqObj.body);
  let users = loadUserJSON();
  if (users[userObj.email]) {
    resObj.render('register_error', { userEmail: userObj.email });
  } else {
    //Update global User object.
    userObj.id = userID;
    users[userID] = userObj;
    users[userObj.email] = userObj.password;
    userID++;
    //Save new user into JSON file.
    try {
      fs.writeFileSync('./User.json', JSON.stringify(users));
    } catch (error) {
      console.log(error);
    }
    console.info(`User ${userObj.firstName} successfuly registered!`)
    resObj.redirect('/');
  }
};

//Routes.
router.get('/', (req, res) => {
  res.send('Main Page');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  saveUserData(req, res);
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  userCredentials = req.body;
  let users = loadUserJSON();
  if (
    users.hasOwnProperty(userCredentials.email) &&
    users[userCredentials.email] === userCredentials.password) {
      jwt.sign(userCredentials.email, "secretWord", function(err, token) {
        res.cookie('auth', token);
        console.info('Login successful!');
        res.redirect('/');
      });
  } else {
    console.info(`User with such email or password does not exists!`);
    res.redirect('/register');
  }
});

router.get("/logout", function(req, res){
  res.clearCookie("auth");
  res.redirect('/');
});

module.exports = router;

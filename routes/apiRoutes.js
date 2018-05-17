const express = require("express");
const router  = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');

let loadUserJSON = () => {
  let Users;
  try {
    Users = JSON.parse(fs.readFileSync(__dirname + '/../User.json', 'utf8'));
    return Users;
  } catch (error) {
    console.info('No User file detected.');
  };
}

//Token verification middleware.
function verifyToken(req, res, next) {
  let token = req.cookies.auth;
  if (token) {
    jwt.verify(token, 'secretWord', function(err, tokenData) {
      if (err) {
         return res.status(403).send('Error');
      } else {
        req.userData = tokenData;
        next();
      }
    });
  } else {
    return res.status(403).send('No token');
  }
};

//API routes.
router.get('/users', verifyToken, (req, res) => {
  let users = loadUserJSON();
  res.json(users);
});

router.get('/users/:id', verifyToken, (req, res) => {
  let users = loadUserJSON();
  if (req.params.id && users[req.params.id]) {
    res.json(users[req.params.id]);
  } else {
    res.send('No User with such ID.');
  }
});

router.delete('/users/:id', verifyToken, (req, res) => {
  let users = loadUserJSON();
  if (req.params.id && users[req.params.id]) {
    delete users[req.params.id];
    try {
      fs.writeFileSync(__dirname + '/../User.json', JSON.stringify(users));
    } catch (error) {
      console.log(error);
    }
    res.send('User deleted!');
  } else {
    res.send('No User with such ID do delete.');
  }
});

router.put('/users/:id', verifyToken, (req, res) => {
  let formData = req.body;
  let users = loadUserJSON();
  if (req.params.id && users[req.params.id]) {
    //Update logic
    let user = users[req.params.id];
    user.firstName = formData.firstName;
    user.email = formData.email;
    users[req.params.id] = user;
    try {
      fs.writeFileSync(__dirname + '/../User.json', JSON.stringify(users));
    } catch (error) {
      console.log(error);
    }
    res.send('User updated!');
  } else {
    res.send('No User with such ID do update.');
  }
});

module.exports = router;

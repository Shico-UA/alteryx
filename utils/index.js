const fs = require('fs');
const jwt = require('jsonwebtoken');

let Utils = {
  checkUserCredentials: (formData, users) => {
    let granted = false;
    for (const user of users) {
      if (user.email === formData.email && user.password === formData.password) {
        granted = true;
      }
    }
    return granted;
  },
  
  checkUserExistenceByEmail: (formData, users) => {
    let exists = false;
    for (const user of users) {
      if (user.email === formData.email) {
        exists = true;
      }
    }
    return exists;
  },

  checkUserExistenceByID: (requesParams, users) => {
    for (const user of users) {
      if (user.id === requesParams.id) {
        return user;
      }
    }
    return false;
  },
  
  loadUserJSON: () => {
    let Users;
    try {
      Users = JSON.parse(fs.readFileSync(__dirname + '/../User.json', 'utf8'));
      return Users;
    } catch (error) {
      console.info('No Users.json file detected');
      return [];
    };
  },

  writeUserJson: (users) => {
    try {
      fs.writeFileSync(__dirname + '/../User.json', JSON.stringify(users));
    } catch (error) {
      console.error(error);
    }
  },

  verifyToken: (req, res, next) => {
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
      return res.status(403).send('Permission denied, check for authorization token failed!');
    }
  },

  logout: (req, res, next) => {
    res.clearCookie("auth");
    console.info('You are logged out!');
    next();
  }
};

module.exports = Utils;

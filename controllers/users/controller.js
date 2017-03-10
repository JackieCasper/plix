const Users = require('../../models/users');
const passport = require('passport');
const AuthService = require('../../services/auth');
// set up the controller
const controller = {};

controller.showLogin = (req, res) => {
  console.log('test');
  res.render('users/login');
}

controller.login = passport.authenticate(
  'local-login', {
    failureRedirect: '/users/login',
    successRedirect: '/users/profile'
  }
);

controller.showNew = (req, res) => {
  res.render('/users/signup');
}

controller.new = passport.authenticate(
  'local-signup', {
    failureRedirect: '/users/new',
    successRedirect: '/users/profile'
  }
);

controller.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

controller.showProfile = (req, res) => {
  const username = req.user.name;
  res.redirect('/users/?user=' + username);
}

controller.showUser = (req, res) => {
  const username = req.query.user;
  Users
    .findPlixByUserName(username)
    .then(data => {
      const renderData = {
        name: username,
        plix: data,
        status: true
      }
      console.log('--------------------------');
      console.log('GOT USER');
      console.log(renderData);
      res.render('/users/show', renderData);
    })
    .catch(err => {
      console.log('----------------------------');
      console.log('ERROR GETTING USER');
      console.log(err);
    });
}

module.exports = controller;
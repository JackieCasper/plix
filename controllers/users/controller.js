const Users = require('../../models/users');
const passport = require('passport');
const AuthService = require('../../services/auth');
// set up the controller
const controller = {};

controller.showLogin = (req, res) => {

  res.render('users/login');
}

controller.login = passport.authenticate(
  'local-login', {
    failureRedirect: '/user/login',
    successRedirect: '/user/profile'
  }
);

controller.showNew = (req, res) => {
  res.render('users/signup');
}

controller.new = passport.authenticate(
  'local-signup', {
    failureRedirect: '/user/signup',
    successRedirect: '/user/profile'
  }
);


controller.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

controller.showProfile = (req, res) => {
  const name = req.user.name;
  console.log(name);
  res.redirect('/user/?name=' + name);

}

controller.test = (req, res, next) => {
  console.log('test');
  console.log(req.body);
  next();
}

controller.showUser = (req, res) => {
  const name = req.query.name;
  Users
    .findPlixByName(name)
    .then(data => {
      const renderData = {
        name: name,
        plix: data
      }
      console.log('--------------------------');
      console.log('GOT USER');
      console.log(renderData);
      res.render('users/show', renderData);
    })
    .catch(err => {
      console.log('----------------------------');
      console.log('ERROR GETTING USER');
      console.log(err);
    });
}

module.exports = controller;
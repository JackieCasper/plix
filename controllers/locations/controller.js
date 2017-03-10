const Locations = require('../../models/locations');
const passport = require('passport');
const AuthService = require('../../services/auth');
// set up the controller
const controller = {};

const keys = require('../../config/keys');


controller.renderLocationSearch = (req, res) => {
  res.render('location/index', {
    placesKey: keys.placesKey
  });
};








module.exports = controller;
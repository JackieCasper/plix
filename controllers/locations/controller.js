const Locations = require('../../models/locations');
const passport = require('passport');
const AuthService = require('../../services/auth');
// set up the controller
const controller = {};


controller.renderLocationSearch = (req, res) => {
  res.render('location/index', {
    placesKey: process.env.PLACES_KEY
  });
};








module.exports = controller;
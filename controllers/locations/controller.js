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

controller.showLocation = (req, res) => {
  Locations
    .findById(req.params.id)
    .then(data => {
      res.render('location/index', {
        location: data,
        placesKey: process.env.PLACES_KEY
      });
    })
    .catch(err => console.log(err))
}


module.exports = controller;
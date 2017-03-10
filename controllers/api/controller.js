const controller = {};
const keys = {
  geoLocationKey: process.env.GEO_LOCATION_KEY,
  placesKey: process.env.PLACES_KEY
};
const AuthService = require('../../services/auth');

controller.getKeys = (req, res) => {
  res.json(keys);
}

module.exports = controller;
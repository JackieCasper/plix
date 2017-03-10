const Locations = require('../../../models/locations');
// set up the controller
const controller = {};

controller.create = (req, res) => {

}

controller.findNearby = (req, res) => {

}

controller.findById = (req, res) => {

}
controller.getGeoIp = (req, res) => {
  res.json(Locations.getGeoIp(req.ip));
}

module.exports = controller;
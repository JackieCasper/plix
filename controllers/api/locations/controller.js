const Locations = require('../../../models/locations');

// set up the controller
const controller = {};

controller.create = (req, res) => {
  const newData = {
    name: req.body.name,
    placeId: req.body.placeId,
    lat: req.body.lat,
    lng: req.body.lng,
    address: req.body.address
  }

}

controller.findNearby = (req, res) => {
  const id = req.params.id;
  Locations
    .findNearbyPlix(id)
    .then(data => {
      console.log('-----------------------');
      console.log('FOUND NEARBY PLIX');
      console.log(data);
      res.json(data);
    })
    .catch(err => {
      console.log('------------------------');
      console.log('ERROR FINDING NEARBY PLIX');
      console.log(err);
    })

}

controller.findById = (req, res) => {

}


controller.getGeoIp = (req, res) => {
  res.json({
    location: Locations.getGeoIp(req.ip),
    ip: req.ip
  });
}

module.exports = controller;
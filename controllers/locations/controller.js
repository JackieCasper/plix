/////////////////////////////////////////////////////
// LOCATIONS CONTROLLER
/////////////////////////////////////////////////////

// get model
const Locations = require('../../models/locations');

// set up the controller
const controller = {};

// render the locations page
controller.find = (req, res) => {
  res.render('location/index', {
    placesKey: process.env.PLACES_KEY
  });
};

// to render a specific location
controller.show = (req, res) => {
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

// export
module.exports = controller;
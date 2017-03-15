/////////////////////////////////////////////////////
// LOCATIONS API CONTROLLER
/////////////////////////////////////////////////////

// require model
const Locations = require('../../../models/locations');

// set up the controller
const controller = {};

// find nearby locations
controller.findNearby = (req, res) => {

  // get the lat, lng and distance
  const searchData = {
    lat: req.body.lat,
    lng: req.body.lng,
    distance: req.body.distance
  }

  Locations
  // get promise to find nearby plix from db
    .findNearby(searchData.lat, searchData.lng, searchData.distance)
    .then(nearbyPlix => {

      // if no nearby plix
      if (!nearbyPlix.length) {
        // send back no results
        res.json({
          plix: [],
          message: 'No Results'
        });

        // if there are nearby plix
      } else {
        // send plix back
        res.json({
          plix: nearbyPlix
        });
      }
    })

  .catch(err => {
    res.send('Error finding nearby plix');
    console.log(err);
  });
}

// fetch place by a given keyword using google places api
controller.fetchPlaceByKeyword = (req, res) => {
  // get lat, lng and keyword
  const fetchData = {
    lat: req.body.lat,
    lng: req.body.lng,
    keyword: req.body.keyword
  }

  // get promise for finding the places
  Locations
    .fetchPlacesByKeyword(fetchData.lat, fetchData.lng, fetchData.keyword)
    .then(data => {
      // turn data into json
      return data.json();
    })
    .then(jsonData => {
      // send json object back
      res.json(jsonData);
    })
    .catch(err => {
      console.log(err);
      res.send('error fetching places');
    });
}


// export
module.exports = controller;
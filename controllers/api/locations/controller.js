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
  const searchData = {
    lat: req.body.lat,
    lng: req.body.lng,
    distance: req.body.distance
  }
  Locations
    .findNearby(searchData.lat, searchData.lng, searchData.distance)
    .then(nearbyPlix => {
      const formattedPlix = [];

      console.log('      ------------------------------');
      console.log('      GOT NEARBY LOCATIONS');
      console.log(nearbyPlix);
      if (!nearbyPlix.length) {
        console.log('NO NEARBY LOCATIONS');
        res.json({
          plix: [],
          message: 'No Results'
        });
      } else {
        res.json({
          plix: nearbyPlix
        })
      }

    })
    .catch(err => {
      console.log('------------------------');
      console.log('ERROR FINDING NEARBY LOCATIONS');
      console.log(err);
    })

}

controller.findById = (req, res) => {

}

controller.fetchPlaceByKeyword = (req, res) => {
  const fetchData = {
    lat: req.body.lat,
    lng: req.body.lng,
    keyword: req.body.keyword
  }
  console.log(fetchData);
  Locations
    .fetchPlacesByKeyword(fetchData.lat, fetchData.lng, fetchData.keyword)
    .then(data => {
      return data.json();
    })
    .then(jsonData => {
      res.json(jsonData);
    })
    .catch(err => {
      console.log(err);
    });
}



module.exports = controller;
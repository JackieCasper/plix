const bcrypt = require('bcrypt');
const db = require('../config/db');
const geoip = require('geoip-lite');
const fetch = require('node-fetch');

const placesKey = process.env.PLACES_KEY;
const Location = {};

Location.getGeoIp = (ip) => geoip.lookup(ip);

Location.create = (name, placeId, address, lat, lng) => {
  return db.one('INSERT INTO locations (name, place_id, address, lat, lng) VALUES ($1, $2, $3, $4, $5) RETURNING id', [name, placeId, address, lat, lng]);
};


Location.findPlix = (id) => {
  return db.many('SELECT * from plix WHERE location_id = $1', [id]);
}

//https://developers.google.com/maps/articles/phpsqlsearch_v3?csw=1
Location.findNearby = (lat, lng, distance) => {
  return db.many(`
        SELECT  
        ( 3959 * ACOS( COS( RADIANS($1) ) * COS( RADIANS( lat ) ) * COS( RADIANS( lng ) - RADIANS($2) ) + SIN( RADIANS($1) ) * SIN( RADIANS( lat ) ) ) ) 
        AS distance, 
        id, name, place_id, address, lat, lng 
        FROM locations 
        HAVING distance < $3
        ORDER BY distance 
        LIMIT 0 , 20`, [lat, lng, distance]);
}

Location.findNearbyPlix = (id, distance) => {
  console.log('------------------------------------');
  console.log('IN GETTING NEARBY PLIX')
  return db.one('SELECT * from locations WHERE location_id = $1', [id])
    .then(center_location => {
      console.log('   ---------------------------------');
      console.log('   GOT LOCATION');
      console.log(center_location);
      Location
        .findNearby(center_location.lat, center_location.lng, distance)
        .then(nearbyLocations => {

          console.log('      ------------------------------');
          console.log('      GOT NEARBY LOCATIONS');
          console.log(nearbyLocations);
          nearbyLocations.forEach(nearbyLocation => {
            Location
              .findPlix(nearbyLocations.id)
              .then(nearbyPlix => {
                console.log('         ---------------------------');
                console.log('         GOT PLIX');
                console.log(nearbyPlix);
                nearbyLocation.plix = nearbyPlix;
              })
              .catch(err => {
                /////////////////////////
                // SET CENTER LOCATION TO ERROR
                /////////////////////////
                console.log('         ---------------------------');
                console.log('         ERROR GETTING PLIX');
                console.log(err);
              });
          });
          center_location.nearby = nearbyLocations;
        })
        .catch(err => {
          /////////////////////////
          // SET CENTER LOCATION TO ERROR
          /////////////////////////
          console.log('      ------------------------------');
          console.log('      ERROR GETTING NEARBY LOCATIONS');
          console.log(err)
        });
    })
}

Location.fetchPlacesByKeyword = (lat, lng, keyword) => {
  return fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&keyword=${keyword}&key=${placesKey}`);
}

module.exports = Location;
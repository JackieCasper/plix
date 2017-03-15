/////////////////////////////////////////////////////
// LOCATIONS MODEL
/////////////////////////////////////////////////////

const db = require('../config/db');
// fetch for making calls to google api
const fetch = require('node-fetch');
const placesKey = process.env.PLACES_KEY;

const Location = {};

// to find a location by its id
Location.findById = (id) => {
  return db.one('SELECT place_id, lat, lng FROM locations WHERE id=$1', [id]);
}

// to create a location
Location.create = (placeId, address, lat, lng) => {
  return db.one('INSERT INTO locations (place_id, address, lat, lng) VALUES ($1, $2, $3, $4) RETURNING id', [placeId, address, lat, lng]);
};

// to find plix at a given location
Location.findPlix = (id) => {
  return db.many('SELECT plix.id, plix.thumb, users.name AS username from plix JOIN users ON plix.user_id = users.id WHERE location_id = $1', [id]);
}

// to find locations within a given radius -- taken from google example
//https://developers.google.com/maps/articles/phpsqlsearch_v3?csw=1
Location.findNearby = (lat, lng, distance, page = 0) => {
  return db.manyOrNone(`
        SELECT ( 3959 * ACOS( COS( RADIANS($1) ) * COS( RADIANS( locations.lat ) ) * COS( RADIANS( locations.lng ) - RADIANS($2) ) + SIN( RADIANS($1) ) * SIN( RADIANS( locations.lat ) ) ) ) AS distance, locations.place_id, locations.address, locations.lat, locations.lng, plix.id, plix.thumb, users.name AS username FROM plix JOIN users ON users.id = plix.user_id JOIN locations ON locations.id = plix.location_id WHERE ( 3959 * ACOS( COS( RADIANS($1) ) * COS( RADIANS( locations.lat ) ) * COS( RADIANS( locations.lng ) - RADIANS($2) ) + SIN( RADIANS($1) ) * SIN( RADIANS( locations.lat ) ) ) ) < $3 ORDER BY distance, plix.plix_date LIMIT 48 OFFSET $4`, [lat, lng, distance, page * 48]);
}

// fetch places given a keyword
Location.fetchPlacesByKeyword = (lat, lng, keyword) => {
  return fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&keyword=${keyword}&key=${placesKey}`);
}

// fetch a place given a google place id
Location.fetchPlaceById = (placeId) => {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${placesKey}`);
}

// find a location by its place id
Location.findByPlaceId = (placeId) => {
  return db.oneOrNone('SELECT id FROM locations WHERE place_id = $1', [placeId]);
}

// export
module.exports = Location;
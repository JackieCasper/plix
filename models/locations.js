const bcrypt = require('bcrypt');
const db = require('../config/db');
const fetch = require('node-fetch');

const placesKey = process.env.PLACES_KEY;
const Location = {};


Location.create = (placeId, address, lat, lng) => {
  return db.one('INSERT INTO locations (place_id, address, lat, lng) VALUES ($1, $2, $3, $4) RETURNING id', [placeId, address, lat, lng]);
};


Location.findPlix = (id) => {
  return db.many('SELECT * from plix WHERE location_id = $1', [id]);
}

//https://developers.google.com/maps/articles/phpsqlsearch_v3?csw=1
Location.findNearby = (lat, lng, distance) => {
  return db.manyOrNone(`
        SELECT ( 3959 * ACOS( COS( RADIANS($1) ) * COS( RADIANS( lat ) ) * COS( RADIANS( lng ) - RADIANS($2) ) + SIN( RADIANS($1) ) * SIN( RADIANS( lat ) ) ) ) AS distance, 
        id, place_id, address, lat, lng FROM locations  
        WHERE ( 3959 * ACOS( COS( RADIANS($1) ) * COS( RADIANS( lat ) ) * COS( RADIANS( lng ) - RADIANS($2) ) + SIN( RADIANS($1) ) * SIN( RADIANS( lat ) ) ) ) < $3
        ORDER BY distance 
        LIMIT 20`, [lat, lng, distance]);
}




Location.fetchPlacesByKeyword = (lat, lng, keyword) => {
  return fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&keyword=${keyword}&key=${placesKey}`);
}

Location.fetchPlaceById = (placeId) => {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${placesKey}`);
}

Location.findByPlaceId = (placeId) => {
  return db.oneOrNone('SELECT id FROM locations WHERE place_id = $1', [placeId]);
}

module.exports = Location;
const bcrypt = require('bcrypt');

const db = require('../config/db');
const aws = require('aws-sdk');
const S3 = new aws.S3();
const Sharp = require('sharp');
const BUCKET = process.env.S3_BUCKET;


const Plix = {};

Plix.findById = (id) => {
  return db.oneOrNone('SELECT plix.id, plix.description, plix.img, plix.thumb, locations.address, locations.id AS location_id, locations.place_id, locations.lat, locations.lng, users.name AS username FROM plix JOIN locations ON locations.id = plix.location_id JOIN users ON users.id = plix.user_id WHERE plix.id = $1', [id]);
}

Plix.search = (searchOptions) => {

}

Plix.delete = (id) => {
  return db.none('DELETE FROM plix WHERE id=$1', [id]);
}


Plix.create = (userId, locationId, description) => {
  return db.one('INSERT INTO plix (user_id, location_id, description) VALUES ($1, $2, $3) RETURNING id', [userId, locationId, description]);
}

Plix.addImg = (id, img, thumb) => {
  return db.one('UPDATE plix SET img = $1, thumb = $2 WHERE id = $3 RETURNING *', [img, thumb, id]);
}

Plix.edit = (description, id) => {
  return db.one('UPDATE plix SET description = $1 WHERE id = $2 RETURNING *', [description, id]);
}

Plix.like = (userId, plixId) => {
  return db.none('INSERT INTO plix_likes (user_id, plix_id, like_combo) VALUES ($1, $2, $3)', [userId, plixId, `${userId},${plixId}`]);
}




module.exports = Plix;
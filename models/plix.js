/////////////////////////////////////////////////////
// PLIX MODEL
/////////////////////////////////////////////////////

const db = require('../config/db');

const Plix = {};

// find a plix, its location, and user by its id
Plix.findById = (id) => {
  return db.oneOrNone('SELECT plix.id, plix.description, plix.img, plix.thumb, locations.address, locations.id AS location_id, locations.place_id, locations.lat, locations.lng, users.name AS username FROM plix JOIN locations ON locations.id = plix.location_id JOIN users ON users.id = plix.user_id WHERE plix.id = $1', [id]);
}

// delete a plix
Plix.delete = (id) => {
  return db.none('DELETE FROM plix WHERE id=$1', [id]);
}

// create a plix
Plix.create = (userId, locationId, description) => {
  return db.one('INSERT INTO plix (user_id, location_id, description) VALUES ($1, $2, $3) RETURNING id', [userId, locationId, description]);
}

// add image and thumb to a plix
Plix.addImg = (id, img, thumb) => {
  return db.one('UPDATE plix SET img = $1, thumb = $2 WHERE id = $3 RETURNING *', [img, thumb, id]);
}

// edit a plix
Plix.edit = (description, id) => {
  return db.one('UPDATE plix SET description = $1 WHERE id = $2 RETURNING *', [description, id]);
}

// export
module.exports = Plix;
const bcrypt = require('bcrypt');

const db = require('../config/db');
const aws = require('aws-sdk');


const Plix = {};

Plix.findById = (id) => {
  return db.oneOrNone('SELECT * FROM plix WHERE id = $1', [id]);
}

Plix.search = (searchOptions) => {

}

Plix.create = (userName, locationId, img, thumb, description) => {

}

Plix.edit = (description, location) => {

}

Plix.getSignedUrl = (fileName, fileType) => {

}

Plix.createThumb = (url, user, plixId) => {

}



module.exports = Plix;
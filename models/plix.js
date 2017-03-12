const bcrypt = require('bcrypt');

const db = require('../config/db');
const aws = require('aws-sdk');
var S3 = new aws.S3();
var Sharp = require('sharp');
var BUCKET = process.env.S3_BUCKET;


const Plix = {};

Plix.findById = (id) => {
  return db.oneOrNone('SELECT plix.id, plix.description, plix.img, plix.thumb, locations.address, locations.id AS location_id, locations.place_id, locations.lat, locations.lng, users.name AS username FROM plix JOIN locations ON locations.id = plix.location_id JOIN users ON users.id = plix.user_id WHERE plix.id = $1', [id]);
}

Plix.search = (searchOptions) => {

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



Plix.uploadAWS = (fileKey, data) => {
  return S3.putObject({
    Body: data,
    Bucket: BUCKET,
    ContentType: 'png',
    Key: fileKey
  }).promise()

}

Plix.createThumb = (fileKey, fileType) => {
  console.log('CREATING THUMB---IN MODEL');
  S3.getObject({
      Bucket: BUCKET,
      Key: fileKey
    }).promise()
    .then(data => {
      console.log('BEFORE SHARP DATA', data);
      Sharp(data.Body)
        .resize(350, 350, {
          centreSampling: true,
        })
        .toBuffer()
        .then(function (buffer) {
          console.log(buffer);
          return S3.putObject({
            Body: buffer,
            Bucket: BUCKET,
            ContentType: fileType,
            Key: 'thumb-' + fileKey
          }).promise()
        })
    })

}


module.exports = Plix;
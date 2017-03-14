const bcrypt = require('bcrypt');

const db = require('../config/db');
const aws = require('aws-sdk');
const S3 = new aws.S3();
const Sharp = require('sharp');
const BUCKET = process.env.S3_BUCKET;

const Images = {};

Images.uploadAWS = (fileKey, fileType, data) => {
  return S3.putObject({
    Body: data,
    Bucket: BUCKET,
    ContentType: fileType,
    Key: fileKey
  }).promise()

}

Images.createThumb = (oldFileKey, newFileKey, fileType, width, height) => {
  console.log('CREATING THUMB---IN MODEL');
  S3.getObject({
      Bucket: BUCKET,
      Key: oldFileKey
    }).promise()
    .then(data => {
      Sharp(data.Body)
        .resize(width, height, {
          centreSampling: true,
        })
        .toBuffer()
        .then(function (buffer) {
          console.log(buffer);
          return S3.putObject({
            Body: buffer,
            Bucket: BUCKET,
            ContentType: fileType,
            Key: newFileKey
          }).promise()
        })
    })

}

module.exports = Images;
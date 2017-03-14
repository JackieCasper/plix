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

Images.sizeImage = (data, width, height) => {
  return Sharp(data)
    .resize(width, height, {
      centreSampling: true
    })
    .toBuffer()
}

Images.rotateImage = (data) => {
  return Sharp(data)
    .rotate()
    .toBuffer()
}

Images.createThumb = (data, fileKey, fileType, width, height) => {
  console.log('CREATING THUMB---IN MODEL');
  return Images
    .sizeImage(data, width, height)
    .then(function (buffer) {
      console.log(buffer);
      return Images.uploadAWS(fileKey, fileType, buffer);
    })
}

module.exports = Images;
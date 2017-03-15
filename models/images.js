/////////////////////////////////////////////////////
// IMAGES MODEL
/////////////////////////////////////////////////////

const db = require('../config/db');
// aws requirements
const aws = require('aws-sdk');
const S3 = new aws.S3();
const BUCKET = process.env.S3_BUCKET;

// sharp - image editing
// http://sharp.dimens.io/en/stable/
const Sharp = require('sharp');

const Images = {};

// upload image to AWS
Images.uploadAWS = (fileKey, fileType, data) => {
  return S3.putObject({
    Body: data,
    Bucket: BUCKET,
    ContentType: fileType,
    Key: fileKey
  }).promise()
}

// size an image to the inputted width and height
Images.sizeImage = (data, width, height) => {
  return Sharp(data)
    .resize(width, height, {
      centreSampling: true
    })
    .toBuffer()
}

// rotate to EXIF Orientation
Images.rotateImage = (data) => {
  return Sharp(data)
    .rotate()
    .toBuffer()
}

// create thumb of image and upload to aws
Images.createThumb = (data, fileKey, fileType, width, height) => {
  return Images
    .sizeImage(data, width, height)
    .then(function (buffer) {
      console.log(buffer);
      return Images.uploadAWS(fileKey, fileType, buffer);
    })
}

// export
module.exports = Images;
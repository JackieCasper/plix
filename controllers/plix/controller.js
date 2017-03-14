const Plix = require('../../models/plix');
const Images = require('../../models/images');
const Locations = require('../../models/locations');
const passport = require('passport');
const AuthService = require('../../services/auth');
// set up the controller
const controller = {};
var busboyPromise = require('busboy-promise');



controller.show = (req, res) => {
  const thisUsername = req.user.name;
  const plixUsername = req.params.user;
  console.log(thisUsername, plixUsername);
  const id = req.params.id;
  Plix
    .findById(id)
    .then(data => {
      console.log('----------------------');
      console.log('GOT PLIX');
      console.log(data);
      if (thisUsername === plixUsername) {
        res.render('plix/show-user', {
          plix: data,
          key: process.env.PLACES_KEY
        })
      } else {
        res.render('plix/show', {
          plix: data,
          key: process.env.PLACES_KEY
        });
      }

    })
    .catch(err => {
      console.log('----------------------');
      console.log('ERROR GETTING PLIX');
      console.log(err);
    });
}



controller.new = (req, res) => {
  const username = req.user.name;
  res.render('plix/new', {
    username: username,
    placesKey: process.env.PLACES_KEY
  });
}

controller.createPlix = (userId, location, description, imageType, imageData, req, res) => {
  const url = 'https://s3.amazonaws.com/jackiecasper-plix/';
  Plix
    .create(userId, location, description)
    .then(createData => {

      let originalFileKey = imageType.split('/');
      originalFileKey = `${userId}-${createData.id}.${originalFileKey[originalFileKey.length-1]}`;
      const thumbFileKey = 'thumb-' + originalFileKey;

      Images
        .rotateImage(imageData)
        .then(buffer => {
          imageData = buffer;
          Images
            .uploadAWS(originalFileKey, imageType, imageData)
            .then(() => {
              Images
                .createThumb(imageData, thumbFileKey, imageType, 350, 350);
              Plix
                .addImg(createData.id, url + originalFileKey, url + thumbFileKey)
                .then(imgData => {
                  res.redirect(`/plix/${req.user.name}/${createData.id}`);
                })
                .catch(err => console.log('ERROR ADDING IMAGE', err))
            })
            .catch(err => console.log('ERROR UPLOADING IMAGE', err));
        })
        .catch(err => console.log('ERROR CREATING PLIX', err));
    })
    .catch(err => console.log('ERROR ROTATING PLIX', err));

}

controller.createNew = (req, res) => {
  console.log(req.files.image);
  const inputData = {
    userId: req.user.id,
    location: req.body.placeId,
    imageData: req.files.image.data,
    imageType: req.files.image.mimetype,
    description: req.body.description
  }

  Locations
    .findByPlaceId(inputData.location)
    .then(location => {

      if (location) {

        inputData.location = location.id;
        controller.createPlix(inputData.userId, inputData.location, inputData.description, inputData.imageType, inputData.imageData, req, res);

      } else {
        Locations
          .fetchPlaceById(inputData.location)
          .then(placeResult => {
            return placeResult.json();
          })
          .then(placeData => {

            const place = {
              lat: placeData.results[0].geometry.location.lat,
              lng: placeData.results[0].geometry.location.lng,
              address: placeData.results[0].formatted_address,
              placeId: placeData.results[0].place_id
            }
            Locations
              .create(place.placeId, place.address, place.lat, place.lng)
              .then(locId => {
                inputData.location = locId.id;
                controller.createPlix(inputData.userId, inputData.location, inputData.description, inputData.imageType, inputData.imageData, req, res);

              })
              .catch(err => console.log('ERROR CREATING LOCATION', err));
          })
          .catch(err => console.log('ERROR FETCHING LOCATION', err))
      }
    })

  .catch(err => console.log('ERROR GETTING LOCATION', err));

}



module.exports = controller;
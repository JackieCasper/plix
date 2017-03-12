const Plix = require('../../models/plix');
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
          plix: data
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

controller.createNew = (req, res) => {
  console.log(req.files.image);
  const inputData = {
    userId: req.user.id,
    location: req.body.placeId,
    imageData: req.files.image.data,
    imageType: req.files.image.mimetype,
    description: req.body.description
  }
  const url = 'https://s3.amazonaws.com/jackiecasper-plix/';
  Locations
    .findByPlaceId(inputData.location)
    .then(location => {

      if (location) {

        inputData.location = location.id;

        Plix
          .create(inputData.userId, inputData.location, inputData.description)
          .then(createData => {

            let fileKey = inputData.imageType.split('/');
            fileKey = `${inputData.userId}-${createData.id}.${fileKey[fileKey.length-1]}`;
            Plix
              .uploadAWS(fileKey, inputData.imageData)
              .then(() => {
                Plix.createThumb(fileKey, inputData.imageType);
                Plix
                  .addImg(createData.id, url + fileKey, url + 'thumb-' + fileKey)
                  .then(imgData => {
                    res.redirect(`/plix/${req.user.name}/${createData.id}`);
                  })
                  .catch(err => console.log('ERROR ADDING IMAGE', err))
              })
              .catch(err => console.log('ERROR UPLOADING IMAGE', err));
          })
          .catch(err => console.log('ERROR CREATING PLIX', err));
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
                Plix
                  .create(inputData.userId, inputData.location, inputData.description)
                  .then(createData => {

                    let fileKey = inputData.imageType.split('/');
                    fileKey = `${inputData.userId}-${createData.id}.${fileKey[fileKey.length-1]}`;
                    Plix
                      .uploadAWS(fileKey, inputData.imageData)
                      .then(() => {
                        Plix.createThumb(fileKey, inputData.imageType);
                        Plix
                          .addImg(createData.id, url + fileKey, url + 'thumb-' + fileKey)
                          .then(imgData => {
                            res.redirect(`/plix/${req.user.name}/${createData.id}`);
                          })
                          .catch(err => console.log('ERROR ADDING IMAGE', err))
                      })
                      .catch(err => console.log('ERROR UPLOADING IMAGE', err));
                  })
                  .catch(err => console.log('ERROR CREATING PLIX', err));

              })
              .catch(err => console.log('ERROR CREATING LOCATION', err));
          })
          .catch(err => console.log('ERROR FETCHING LOCATION', err))
      }
    })

  .catch(err => console.log('ERROR GETTING LOCATION', err));

}



module.exports = controller;
/////////////////////////////////////////////////////
// PLIX CONTROLLER
/////////////////////////////////////////////////////

// models
const Plix = require('../../models/plix');
const Images = require('../../models/images');
const Locations = require('../../models/locations');


// set up the controller
const controller = {};


// to show a plix
controller.show = (req, res) => {
  // get the viewing user's name
  const thisUsername = req.user.name;

  // get the plix's user's name
  const plixUsername = req.params.user;

  // get the plix id
  const id = req.params.id;

  // get promise to find by id
  Plix
    .findById(id)
    .then(data => {
      // Plix
      //   .findComments(id)
      //   .then(comments=>{
          // if it is the viewer's plix
          if (thisUsername === plixUsername) {
            // render the page for the viewer
            const renderData = {
              plix: data,
              key: process.env.PLACES_KEY,
              profileClass: '',
              profileText: 'Make Profile Image',
              // comments: comments,
              // commentsLength: comments.length,
              // username: req.user.name,
              // userImg: req.user.profile_img
            }

            // if it is the user's profile picture
            if (data.thumb === req.user.profile_img) {
              // set profile picture data
              renderData.profileClass = 'is-profile';
              renderData.profileText = 'Profile Image';
            }

            // render the page
            res.render('plix/show-user', renderData)
              // if its not the viewer's plix
          } else {
            // render the page
            res.render('plix/show', {
              plix: data,
              key: process.env.PLACES_KEY,
              // comments: comments,
              // commentsLength: comments.length,
              // username: req.user.name,
              // userImg: req.user.profile_img
            });
          }
        // })
        // .catch(err=>console.log(err));
    })
    .catch(err => {
      console.log(err);
    });
}


// show new plix page
controller.new = (req, res) => {
  const username = req.user.name;
  res.render('plix/new', {
    username: username,
    placesKey: process.env.PLACES_KEY
  });
}

// to create a plix
controller.createPlix = (userId, location, description, imageType, imageData, req, res) => {
  // start of the image url
  const url = process.env.AWS_ROOT_URL || 'https: //s3.amazonaws.com/jackiecasper-plix/';
  // create the plix without the images first,
  Plix
    .create(userId, location, description)
    //getting the plix id back
    .then(createData => {
      // get the file extention
      let originalFileKey = imageType.split('/');

      // build the file key
      originalFileKey = `${userId}-${createData.id}.${originalFileKey[originalFileKey.length-1]}`;

      // build the thumb key
      const thumbFileKey = 'thumb-' + originalFileKey;

      // get promise to rotate, upload, create thumb, and add the images to the db
      Images
        .rotateImage(imageData)
        // get buffer after rotate
        .then(buffer => {
          // set image data to buffer
          imageData = buffer;

          Images
          // upload
            .uploadAWS(originalFileKey, imageType, imageData)
            .then(() => {

              Images
              //create thumb
                .createThumb(imageData, thumbFileKey, imageType, 350, 350);

              Plix
              // add images to db
                .addImg(createData.id, url + originalFileKey, url + thumbFileKey)
                .then(imgData => {
                  // redirect to the newly created plix
                  res.redirect(`/plix/${req.user.name}/${createData.id}`);
                })
                //catch all the errors
                .catch(err => console.log('ERROR ADDING IMAGE', err))
            })
            .catch(err => console.log('ERROR UPLOADING IMAGE', err));
        })
        .catch(err => console.log('ERROR CREATING PLIX', err));
    })
    .catch(err => console.log('ERROR ROTATING PLIX', err));

}

// create new first step - mostly dealing with location stuff,
// also getting the image data
controller.createNew = (req, res) => {
  // get the user id, location, image data, image type, and description
  const inputData = {
    userId: req.user.id,
    location: req.body.placeId,
    imageData: req.files.image.data,
    imageType: req.files.image.mimetype,
    description: req.body.description
  }

  // get promise to find the location
  Locations
    .findByPlaceId(inputData.location)
    .then(location => {


      if (location) { // if the location exists
        // set the location to the id
        inputData.location = location.id;
        // create the plix
        controller.createPlix(inputData.userId, inputData.location, inputData.description, inputData.imageType, inputData.imageData, req, res);

      } else { // if the location doesn't exist
        // fetch the place from google maps api
        Locations
          .fetchPlaceById(inputData.location)
          .then(placeResult => {
            // set to json
            return placeResult.json();
          })
          .then(placeData => {
            // get place info - lat, lng, address, place id
            const place = {
              lat: placeData.results[0].geometry.location.lat,
              lng: placeData.results[0].geometry.location.lng,
              address: placeData.results[0].formatted_address,
              placeId: placeData.results[0].place_id
            }

            // get promise to create the location
            Locations
              .create(place.placeId, place.address, place.lat, place.lng)
              .then(locId => {
                // set the location to the id
                inputData.location = locId.id;
                // create the plix
                controller.createPlix(inputData.userId, inputData.location, inputData.description, inputData.imageType, inputData.imageData, req, res);

                // catch all the errors
              })
              .catch(err => console.log('ERROR CREATING LOCATION', err));
          })
          .catch(err => console.log('ERROR FETCHING LOCATION', err))
      }
    })
    .catch(err => console.log('ERROR GETTING LOCATION', err));
}


// export
module.exports = controller;

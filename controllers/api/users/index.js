/////////////////////////////////////////////////////
// USER API ROUTER
/////////////////////////////////////////////////////

// set up router
const router = require('express').Router();
const controller = require('./controller');

//set up routes

// to validate the form
//router.post('/signup/validateform/', controller.validate);

// to validate a form input
//router.post('/signup/validateinput/:input', controller.validateInput);

// to follow a user
router.post('/follow', controller.setFollow);

// to search users
router.post('/search', controller.search);

// to set a user's profile image
router.post('/:name/setprofile', controller.setProfile);

// export
module.exports = router;
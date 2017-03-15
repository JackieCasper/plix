/////////////////////////////////////////////////////
// LOCATIONS ROUTER
/////////////////////////////////////////////////////

// set up router
const router = require('express').Router();
// get the controller
const controller = require('./controller');
// auth service to handle authentication
const AuthService = require('../../services/auth');

// to view the location search
router.get('/', AuthService.redirect, controller.find);
// to view a specific location 
router.get('/:id', AuthService.redirect, controller.show);

// export
module.exports = router;
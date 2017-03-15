/////////////////////////////////////////////////////
// PLIX ROUTER
/////////////////////////////////////////////////////

// set up router
const router = require('express').Router();
// get controller
const controller = require('./controller');
// auth service to handle authentication
const AuthService = require('../../services/auth');

// to render the new page
router.get('/new/', AuthService.redirect, controller.new);

// to create a new plix
router.post('/new/', AuthService.redirect, controller.createNew);

// to view a plix
router.get('/:user/:id', AuthService.redirect, controller.show);

// export
module.exports = router;
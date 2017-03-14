// set up router
const router = require('express').Router();
const controller = require('./controller');
const AuthService = require('../../services/auth');

router.get('/', AuthService.redirect, controller.renderLocationSearch);
router.get('/:id', AuthService.redirect, controller.showLocation);



module.exports = router;
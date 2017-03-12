// set up router
const router = require('express').Router();
const controller = require('./controller');
const AuthService = require('../../services/auth');
router.get('/new/', AuthService.redirect, controller.new);
router.post('/new/', AuthService.redirect, controller.createNew);
router.get('/:user/:id', controller.show);


module.exports = router;
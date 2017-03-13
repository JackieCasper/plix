// set up router
const router = require('express').Router();
const controller = require('./controller');
const AuthService = require('../../services/auth');

router.get('/login/', AuthService.redirectUser, controller.showLogin);
router.post('/login/', controller.test, controller.login);
router.get('/signup/', AuthService.redirectUser, controller.showNew);
router.post('/new/', controller.test, controller.new);
router.get('/profile', AuthService.redirect, controller.showProfile);
router.get('/logout', controller.logout);
router.get('/:name', AuthService.redirect, controller.showUser);




module.exports = router;
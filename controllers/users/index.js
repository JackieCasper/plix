// set up router
const router = require('express').Router();
const controller = require('./controller');
const AuthService = require('../../services/auth');

router.get('/login/', AuthService.redirectUser, controller.showLogin);
router.post('/login/', controller.test, controller.login);
router.get('/signup/', AuthService.redirectUser, controller.showNew);
router.post('/new/', controller.test, controller.new);
router.get('/profile', AuthService.redirect, controller.showProfile);
router.get('/', AuthService.redirect, controller.showUser);
router.get('/logout', AuthService.redirect, controller.logout);



module.exports = router;
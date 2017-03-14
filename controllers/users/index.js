// set up router
const router = require('express').Router();
const controller = require('./controller');
const AuthService = require('../../services/auth');

router.get('/login/', AuthService.redirectUser, controller.showLogin);
router.post('/login/', controller.login);
router.get('/signup/', AuthService.redirectUser, controller.showNew);
router.post('/new/', controller.new);
router.get('/profile', AuthService.redirect, controller.showProfile);
router.get('/logout', controller.logout);
router.get('/feed', AuthService.redirect, controller.showFeed);
router.get('/find', AuthService.redirect, controller.findUsers);
router.get('/:name', AuthService.redirect, controller.showUser);
router.get('/:name/:following', AuthService.redirect, controller.showFollowing);





module.exports = router;
/////////////////////////////////////////////////////
// USER ROUTER
/////////////////////////////////////////////////////

// set up router
const router = require('express').Router();
const controller = require('./controller');
const AuthService = require('../../services/auth');

// if logged in, direct to feed, if not go to login page
router.get('/login/', AuthService.redirectUser, controller.showLogin);
// post to log in
router.post('/login/', controller.login);
// render sign up page -- moved to landing page
//router.get('/signup/', AuthService.redirectUser, controller.showNew);
// post to create new user
router.post('/new/', controller.new);
// viewer's profile
router.get('/profile', AuthService.redirect, controller.showProfile);
// logout
router.get('/logout', controller.logout);
// viewer's feed
router.get('/feed', AuthService.redirect, controller.showFeed);
// find users
router.get('/find', AuthService.redirect, controller.findUsers);
// view a user
router.get('/:name', AuthService.redirect, controller.showUser);
// view a users following/followers
router.get('/:name/:following', AuthService.redirect, controller.showFollowing);

//export
module.exports = router;
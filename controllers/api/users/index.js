// set up router
const router = require('express').Router();
const controller = require('./controller');


router.post('/signup/validateform/', controller.validate);
router.post('/signup/validateinput/:input', controller.validateInput);
router.post('/follow', controller.setFollow);
router.post('/search', controller.search);
router.post('/:name/setprofile', controller.setProfile);

module.exports = router;
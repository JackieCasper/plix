// set up router
const router = require('express').Router();
const controller = require('./controller');
const AuthService = require('../../services/auth');



router.use('/users/', require('./users/'));
router.use('/locations/', require('./locations/'));
router.use('/plix/', require('./plix/'));

module.exports = router;
// set up router
const router = require('express').Router();
const controller = require('./controller');



router.use('/users/', require('./users/'));
router.use('/locations/', require('./locations/'));
router.use('/plix/', require('./plix/'));
router.get('/keys', controller.getKeys);

module.exports = router;
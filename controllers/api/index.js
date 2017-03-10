// set up router
const router = require('express').Router();

router.use('/users/', require('./users/'));
router.use('/locations/', require('./locations/'));
router.use('/plix/', require('./plix/'));

module.exports = router;
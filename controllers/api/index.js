/////////////////////////////////////////////////////
// Router for API
/////////////////////////////////////////////////////

// set up router
const router = require('express').Router();

// set up routes

// users
router.use('/users/', require('./users/'));

// locations
router.use('/locations/', require('./locations/'));

// plix
router.use('/plix/', require('./plix/'));


// export
module.exports = router;
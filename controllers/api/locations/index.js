/////////////////////////////////////////////////////
// LOCATIONS API ROUTER
/////////////////////////////////////////////////////

// set up router
const router = require('express').Router();
// get controller
const controller = require('./controller');

// set up routes
// to fetch place by keyword
router.post('/places/keyword', controller.fetchPlaceByKeyword);
// to find nearby plix
router.post('/nearbyPlix', controller.findNearby)

// export
module.exports = router;
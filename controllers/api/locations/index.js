// set up router
const router = require('express').Router();
const controller = require('./controller');

router.post('/places/keyword', controller.fetchPlaceByKeyword);
router.post('/nearbyPlix', controller.findNearby)


module.exports = router;
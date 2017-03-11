// set up router
const router = require('express').Router();
const controller = require('./controller');

router.get('/geolocation', controller.getGeoIp);
router.post('/places/keyword', controller.fetchPlaceByKeyword);


module.exports = router;
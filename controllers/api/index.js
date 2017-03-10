// set up router
const router = require('express').Router();
const keys = require('../../config/keys');

router.use('/users/', require('./users/'));
router.use('/locations/', require('./locations/'));
router.use('/plix/', require('./plix/'));
router.get('/keys', (req, res) => {
  res.json(keys);
});

module.exports = router;
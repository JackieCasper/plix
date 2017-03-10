// set up router
const router = require('express').Router();

router.use('/api/', require('./controllers/api/'));

module.exports = router;
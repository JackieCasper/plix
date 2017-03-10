// set up router
const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.renderLocationSearch);



module.exports = router;
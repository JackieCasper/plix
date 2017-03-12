// set up router
const router = require('express').Router();
const controller = require('./controller');

router.put('/:id', controller.update);


module.exports = router;
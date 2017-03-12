// set up router
const router = require('express').Router();
const controller = require('./controller');

router.put('/:id', controller.update);
router.delete('/:id', controller.delete);


module.exports = router;
/////////////////////////////////////////////////////
// PLIX API ROUTER
/////////////////////////////////////////////////////

// set up router and controller
const router = require('express').Router();
const controller = require('./controller');

// to edit a plix
router.put('/:id', controller.update);
// to delete a plix
router.delete('/:id', controller.delete);

// export
module.exports = router;
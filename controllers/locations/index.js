// set up router
const router = require('express').Router();
const controller = require('./controller');
const AuthService = require('../../services/auth');

router.get('/', controller.renderLocationSearch);
router.get('/:id', controller.showLocation);



module.exports = router;
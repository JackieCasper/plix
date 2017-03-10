// set up router
const router = require('express').Router();

router.use('/api/', require('./controllers/api/'));
router.use('/locations/', require('./controllers/locations/'));
router.use('/user/', require('./controllers/users/'));
router.get('/', (req, res) => res.render('index'));


module.exports = router;
const Plix = require('../../../models/plix');
const passport = require('passport');
// set up the controller
const controller = {};
const Images = require('../../../models/images');




controller.update = (req, res) => {
  const updateData = {
    id: req.params.id,
    description: req.body.description
  }
  Plix
    .edit(updateData.description, updateData.id)
    .then(data => {
      res.json({
        plix: data
      });
    })
    .catch(err => console.log('ERROR UPDATING PLIX', err));
}


controller.delete = (req, res) => {
  Plix
    .delete(req.params.id)
    .then(() => {
      res.send('plix deleted');
    })
    .catch(err => console.log(err));
}


module.exports = controller;
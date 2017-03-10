const Plix = require('../../models/plix');
const passport = require('passport');
const AuthService = require('../../services/auth');
// set up the controller
const controller = {};

controller.show = AuthService.redirect, (req, res) => {
  const id = req.params.id;
  Plix
    .findById(id)
    .then(data => {
      console.log('----------------------');
      console.log('GOT PLIX');
      console.log(data);
      res.render('/plix/show');
    })
    .catch(err => {
      console.log('----------------------');
      console.log('ERROR GETTING PLIX');
      console.log(err);
    });
}



module.exports = controller;
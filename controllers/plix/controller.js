const Plix = require('../../models/plix');
const passport = require('passport');
const AuthService = require('../../services/auth');
// set up the controller
const controller = {};
var busboyPromise = require('busboy-promise');

controller.show = (req, res) => {
  const id = req.params.id;
  Plix
    .findById(id)
    .then(data => {
      console.log('----------------------');
      console.log('GOT PLIX');
      console.log(data);
      res.render('plix/show');
    })
    .catch(err => {
      console.log('----------------------');
      console.log('ERROR GETTING PLIX');
      console.log(err);
    });
}

controller.new = (req, res) => {
  const username = req.user.name;
  res.render('plix/new', {
    username: username,
    placesKey: process.env.PLACES_KEY
  });
}

controller.createNew = (req, res) => {
  busboyPromise(req)
    .then(function (parts) {
      console.log('IN BUSBOY');
      for (var name in parts.files) {
        console.log(parts.files[name]);
      }
    });
}



module.exports = controller;
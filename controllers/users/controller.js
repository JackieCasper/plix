const Users = require('../../models/users');
const passport = require('passport');
const AuthService = require('../../services/auth');
// set up the controller
const controller = {};

controller.showPlix = AuthService.redirect, (req, res) => {

}


module.exports = controller;
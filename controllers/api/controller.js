const controller = {};
const keys = require('../../config/keys');
const AuthService = require('../../services/auth');

controller.getKeys = (req, res) => {
  res.json(keys);
}

module.exports = controller;
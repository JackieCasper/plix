const bcrypt = require('bcrypt');

const db = require('../config/db');
const geoip = require('geoip-lite');

const Location = {};

Location.getGeoIp = (ip) => geoip.lookup(ip);

module.exports = Location;
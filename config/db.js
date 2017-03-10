// set up database
const pgp = require('pg-promise')();

const db = pgp(
  process.env.DATABASE_URL || 'postgres://jackie@localhost:5432/plix');


module.exports = db;
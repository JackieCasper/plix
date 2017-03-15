/////////////////////////////////////////////////////
// DATABASE SET UP
/////////////////////////////////////////////////////

// pg-promise interface for PostgreSQL
const pgp = require('pg-promise')();

// set up
const db = pgp(
  process.env.DATABASE_URL || 'postgres://jackie@localhost:5432/plix');

// export
module.exports = db;
const bcrypt = require('bcrypt');

const db = require('../config/db');

const User = {};

User.findByEmail = (email) => {
  return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
}


User.nameExists = (name) => {
  return db.oneOrNone('SELECT id FROM users WHERE name = $1', [name]);
}

User.emailExists = (email) => {
  return db.oneOrNone('SELECT id FROM users WHERE email = $1', [email]);
}

User.create = (email, name, password) => {
  console.log(password);
  const passwordDigest = bcrypt.hashSync(password, 10);
  return db.oneOrNone('INSERT INTO users (email, name, password_digest) VALUES ($1, $2, $3) RETURNING *', [email, name, passwordDigest]);
}

User.findName = (email) => {
  return db.one('SELECT name FROM users WHERE email = $1', [email]);
}

User.findPlixByName = (name) => {

  return db.manyOrNone('SELECT plix.id, plix.thumb FROM plix JOIN users ON plix.user_id = users.id WHERE users.name = $1 ORDER BY plix.plix_date', [name]);


}



module.exports = User;
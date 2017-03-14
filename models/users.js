const bcrypt = require('bcrypt');

const db = require('../config/db');

const User = {};

User.findByEmail = (email) => {
  return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email.toUpperCase()]);
}

User.nameExists = (name) => {
  return db.oneOrNone('SELECT id FROM users WHERE name = $1', [name]);
}

User.emailExists = (email) => {
  return db.oneOrNone('SELECT id FROM users WHERE email = $1', [email.toUpperCase()]);
}

User.exists = (name, email) => {
  return db.task(t => {
    // creating a sequence of transaction queries:
    const q1 = t.oneOrNone('SELECT id FROM users WHERE name = $1', [name]);
    const q2 = t.oneOrNone('SELECT id FROM users WHERE email = $1', [email]);

    // returning a promise that determines a successful transaction:
    return t.batch([q1, q2]);
  });
}

User.create = (email, name, password) => {
  console.log(password);
  const passwordDigest = bcrypt.hashSync(password, 10);
  return db.oneOrNone('INSERT INTO users (email, name, password_digest) VALUES ($1, $2, $3) RETURNING *', [email.toUpperCase(), name, passwordDigest]);
}

User.findName = (email) => {
  return db.one('SELECT name FROM users WHERE email = $1', [email]);
}

User.findPlixByName = (name) => {
  return db.task(t => {
    const q1 = t.oneOrNone('SELECT id FROM users WHERE users.name = $1', [name]);
    const q2 = t.manyOrNone('SELECT plix.id, plix.thumb FROM plix JOIN users ON plix.user_id = users.id WHERE users.name = $1 ORDER BY plix.plix_date LIMIT 48', [name]);
    return t.batch([q1, q2])
  });
}

User.getFollowCount = (id) => {
  return db.task(t => {
    const q1 = t.oneOrNone('SELECT COUNT(id) AS following_count FROM user_follows WHERE user_id = $1', [id]);
    const q2 = t.oneOrNone('SELECT COUNT(id) AS follower_count FROM user_follows WHERE follow_id = $1', [id]);
    return t.batch([q1, q2]);
  })
}

User.getFollowing = (userid, following) => {
  return db.oneOrNone('SELECT id FROM user_follows WHERE user_id = $1 AND follow_id = $2', [userid, following]);
}

User.follow = (userid, following) => {
  return db.one('INSERT INTO user_follows (user_id, follow_id) VALUES ($1, $2) RETURNING id', [userid, following]);
}

User.unfollow = (userid, following) => {
  return db.none('DELETE FROM user_follows WHERE user_id = $1 AND follow_id = $2', [userid, following])
}

User.findFollowing = (name, following) => {

  return db.task(t => {
    let q1;
    if (following === 'followers') {
      q1 = t.manyOrNone('SELECT user_follows.user_id, follow_user.name AS follow_name FROM user_follows JOIN users AS follow_user ON follow_user.id = user_follows.user_id JOIN users AS users ON user_follows.follow_id = users.id WHERE users.name = $1', [name]);


    } else if (following === 'following') {
      q1 = t.manyOrNone('SELECT user_follows.follow_id, follow_user.name AS follow_name FROM user_follows JOIN users AS follow_user ON follow_user.id = user_follows.follow_id JOIN users AS users ON user_follows.user_id = users.id WHERE users.name = $1', [name]);
    }

    const q2 = t.one('SELECT id FROM users WHERE name = $1', [name]);

    return t.batch([q1, q2]);
  })

}


User.getFeed = (id, page) => {
  return db.manyOrNone('SELECT users.name AS username, plix.img AS image, plix.location_id, plix.id, locations.address FROM users AS users JOIN user_follows ON user_follows.follow_id = users.id JOIN plix ON plix.user_id = users.id JOIN locations ON locations.id = plix.location_id WHERE user_follows.user_id = $1 ORDER BY plix.plix_date LIMIT 24 OFFSET $2', [id, page * 24]);
}

User.search = (keyword) => {
  return db.manyOrNone(`SELECT name FROM users WHERE (UPPER(name) LIKE '%'||$1) OR (UPPER(name) LIKE $1||'%') LIMIT 24`, [keyword]);
}


module.exports = User;
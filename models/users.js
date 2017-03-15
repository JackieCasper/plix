/////////////////////////////////////////////////////
// USER MODEL
/////////////////////////////////////////////////////

// bcrypt for password encryption
const bcrypt = require('bcrypt');
const db = require('../config/db');
const User = {};

// find a user by its id
User.findByEmail = (email) => {
  return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email.toUpperCase()]);
}

// check if a username exists
User.nameExists = (name) => {
  return db.oneOrNone('SELECT id FROM users WHERE name = $1', [name]);
}

// check if an email exists
User.emailExists = (email) => {
  return db.oneOrNone('SELECT id FROM users WHERE email = $1', [email.toUpperCase()]);
}

// check if a username or email exists
User.exists = (name, email) => {
  return db.task(t => {
    // creating a sequence of transaction queries:
    const q1 = t.oneOrNone('SELECT id FROM users WHERE name = $1', [name]);
    const q2 = t.oneOrNone('SELECT id FROM users WHERE email = $1', [email]);

    // returning a promise that determines a successful transaction:
    return t.batch([q1, q2]);
  });
}

// create a user
User.create = (email, name, password) => {
  const defaultPhoto = '/img/defaultprofile.png';
  const passwordDigest = bcrypt.hashSync(password, 10);
  return db.oneOrNone('INSERT INTO users (email, name, password_digest, profile_img) VALUES ($1, $2, $3, $4) RETURNING *', [email.toUpperCase(), name, passwordDigest, defaultPhoto]);
}

// get a user's name by a user's email
User.findName = (email) => {
  return db.one('SELECT name FROM users WHERE email = $1', [email]);
}

// find a user's plix by username
User.findPlixByName = (name) => {
  return db.task(t => {
    const q1 = t.oneOrNone('SELECT id, profile_img FROM users WHERE users.name = $1', [name]);
    const q2 = t.manyOrNone('SELECT plix.id, plix.thumb FROM plix JOIN users ON plix.user_id = users.id WHERE users.name = $1 ORDER BY plix.plix_date LIMIT 48', [name]);
    return t.batch([q1, q2])
  });
}

// get the count of the users following and followers
User.getFollowCount = (id) => {
  return db.task(t => {
    const q1 = t.oneOrNone('SELECT COUNT(id) AS following_count FROM user_follows WHERE user_id = $1', [id]);
    const q2 = t.oneOrNone('SELECT COUNT(id) AS follower_count FROM user_follows WHERE follow_id = $1', [id]);
    return t.batch([q1, q2]);
  })
}

// check if a user is following another
User.getFollowing = (userid, following) => {
  return db.oneOrNone('SELECT id FROM user_follows WHERE user_id = $1 AND follow_id = $2', [userid, following]);
}

// set follow a user
User.follow = (userid, following) => {
  return db.one('INSERT INTO user_follows (user_id, follow_id) VALUES ($1, $2) RETURNING id', [userid, following]);
}

// unfollow a user
User.unfollow = (userid, following) => {
  return db.none('DELETE FROM user_follows WHERE user_id = $1 AND follow_id = $2', [userid, following])
}

// find both following and followers
User.findFollowing = (name, following) => {

  return db.task(t => {
    let q1;
    if (following === 'followers') {
      q1 = t.manyOrNone('SELECT user_follows.user_id, follow_user.name AS follow_name FROM user_follows JOIN users AS follow_user ON follow_user.id = user_follows.user_id JOIN users AS users ON user_follows.follow_id = users.id WHERE users.name = $1 ORDER BY follow_user.name', [name]);


    } else if (following === 'following') {
      q1 = t.manyOrNone('SELECT user_follows.follow_id, follow_user.name AS follow_name FROM user_follows JOIN users AS follow_user ON follow_user.id = user_follows.follow_id JOIN users AS users ON user_follows.user_id = users.id WHERE users.name = $1', [name]);
    }

    const q2 = t.one('SELECT id FROM users WHERE name = $1', [name]);

    return t.batch([q1, q2]);
  })

}

// get a user's feed
User.getFeed = (id, page = 0) => {
  return db.manyOrNone('SELECT users.name AS username, plix.img AS image, plix.location_id, plix.id, locations.address FROM users AS users JOIN user_follows ON user_follows.follow_id = users.id JOIN plix ON plix.user_id = users.id JOIN locations ON locations.id = plix.location_id WHERE user_follows.user_id = $1 ORDER BY plix.plix_date DESC LIMIT 24 OFFSET $2', [id, page * 24]);
}

// search for a user
User.search = (keyword) => {
  return db.manyOrNone(`SELECT name FROM users WHERE (UPPER(name) LIKE '%'||$1) OR (UPPER(name) LIKE $1||'%') OR (UPPER(name) LIKE '%'||$1||'%') ORDER BY name LIMIT 24`, [keyword]);
}

// set a user's profile picture
User.setProfile = (img, name) => {
  return db.none('UPDATE users SET profile_img = $1 WHERE name = $2', [img, name]);
}

// export the user
module.exports = User;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_follows;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS plix CASCADE;


CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL UNIQUE,
  password_digest VARCHAR NOT NULL,
  profile_img VARCHAR NOT NULL
);

CREATE TABLE user_follows (
  id BIGSERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  follow_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE locations (
  id BIGSERIAL PRIMARY KEY,
  place_id VARCHAR NOT NULL,
  address VARCHAR(80) NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL
);

CREATE TABLE plix (
  id BIGSERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  location_id INT REFERENCES locations(id) ON DELETE CASCADE NOT NULL,
  img VARCHAR,
  thumb VARCHAR,
  description VARCHAR(255) NOT NULL,
  plix_date TIMESTAMP NOT NULL DEFAULT NOW()
);


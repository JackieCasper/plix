/////////////////////////////////////////////////////
// MAIN FILE - SETS UP APP AND USER AUTHENTICATION
/////////////////////////////////////////////////////

// Dot env for development, using heroku config for release
// const dotenv = require('dotenv');
// dotenv.load();

// REQUIRES
// express - web framework
const express = require('express');

// morgan - request logger
const logger = require('morgan');

// passport - authentication middleware
const passport = require('passport');

// express-session - session middleware
const session = require('express-session');

// cookie-parser - handling cookies
const cookieParser = require('cookie-parser');

// mustache-express - templates
const mustacheExpress = require('mustache-express');

// flash - session message storing
const flash = require('connect-flash');

// body-parser - parse incoming request bodies
const bodyParser = require('body-parser');

// busboy-body-parser multipart/form-data
const busboyBodyParser = require('busboy-body-parser');

// Create app and set port
const app = express();
const PORT = process.env.PORT || 3000;


// app setup
app.engine('html', mustacheExpress());
app.set('view engine', 'html');

// view directory
app.set('views', __dirname + '/views');
// public directory
app.use(express.static(__dirname + '/public'));

// body-parser setup
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// busboy body parser for multipart/form-data
// https://www.npmjs.com/package/busboy-body-parser
app.use(busboyBodyParser());


// Passport set up used almost directly from Tims lesson
// https://git.generalassemb.ly/wdi-nyc-1-30/w06-d04-passport-express
// Start session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// init passport
app.use(passport.initialize());
// passport session
app.use(passport.session({
  pauseStream: true
}));
// logger - morgan
app.use(logger('dev'));

app.use(cookieParser());

app.use(flash());

// ============================================================
// Configure passport for a local signup strategy:

// user model
const User = require('./models/users');

// local strategy for passport
const LocalStrategy = require('passport-local').Strategy;

// bcrypt - encryption
const bcrypt = require('bcrypt');

// searlize user information
passport.serializeUser((user, done) => {
  done(null, user);
});

// desearlize user information
passport.deserializeUser((userObj, done) => {
  User
  // find user by email
    .findByEmail(userObj.email)
    // then send info back
    .then((user) => done(null, user))
    // catch error
    .catch((err) => {
      console.log('ERROR:', err);
      return done(null, false);
    });
});

// for local sign up
passport.use(
  'local-signup',
  new LocalStrategy({
    // get email and password
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {

    User
    // create user
      .create(req.body.email, req.body.name, req.body.password)
      .then((user) => {
        // return the user
        return done(null, user);
      })
      // if there is an error
      .catch((err) => {
        console.log('ERROR:', err);
        return done(null, false, {
          message: 'Error creating user'
        });
      });
  })
);

// for local login
passport.use(
  'local-login',
  new LocalStrategy({
    // get email and password
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {

    User
    // find by email
      .findByEmail(email)
      .then((user) => {
        if (user) {
          // here we use bcrypt to figure out whether the user is logged in or not
          const isAuthed = bcrypt.compareSync(password, user.password_digest);
          // if auth
          if (isAuthed) {
            // return the user
            return done(null, user);
          } else {
            // incorrect password
            return done(null, false, {
              message: 'Incorrect password.'
            });
          }
          // if user doesn't exist
        } else {
          return done(null, false, {
            message: 'Incorrect email.'
          });
        }
      });
  })
);

// END OF PASSPORT SETUP SECTION
// ============================================================

// connect router
app.use(require('./router'));


// listen
app.listen(PORT, () => console.log('Server is listening on port', PORT));

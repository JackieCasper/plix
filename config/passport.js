const passport = require('passport');
// We're going to need the User model
const User = require('./models/user');
// And we're going to need the Local Strategy for this kind of registration
const LocalStrategy = require('passport-local').Strategy;
// We'll also need bcrypt to authenticate uses without storing their
// passoword _anywhere_...
const bcrypt = require('bcrypt');

const Passport = {};


Passport.init = () => {
  // Important: mount express middleware BEFORE passport middleware
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());

  app.use(passport.session());

  app.use(logger('dev'));

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(cookieParser());

  app.use(flash());




  // Given user information called "user", what do we want to serialize
  // to the session?
  passport.serializeUser((user, done) => {
    console.log('----------------------------------------');
    console.log('in passport.serializeUser callback');
    console.log('user: ');
    console.log(user);

    done(null, user);
  });

  // Given an object representing our user (obtained from the session),
  // how shall we define any other user information we'll need in our
  // routes, conveniently accessible as req.user in routes?
  passport.deserializeUser((userObj, done) => {
    console.log('----------------------------------------');
    console.log('in passport.deserializeUser callback');
    console.log('userObj: ');
    console.log(userObj);

    User
      .findByEmail(userObj.email)
      .then((user) => done(null, user))
      .catch((err) => {
        console.log('ERROR:', err);
        return done(null, false);
      });
  });

  // see router.post('/', ...) in controllers/users
  passport.use(
    'local-signup',
    new LocalStrategy({
      // these are the names of the fields for email and password in
      // the login form we'll be serving (see the view)
      usernameField: 'user[email]',
      passwordField: 'user[password]',
      passReqToCallback: true
    }, (req, email, password, done) => {
      User
        .create(req.body.user)
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          console.log('ERROR:', err);
          return done(null, false);
        });
    })
  );

  passport.use(
    'local-login',
    new LocalStrategy({
      usernameField: 'user[email]',
      passwordField: 'user[password]',
      passReqToCallback: true
    }, (req, email, password, done) => {
      User
        .findByEmail(email)
        .then((user) => {
          if (user) {
            // here we use bcrypt to figure out whether the user is logged in or not
            const isAuthed = bcrypt.compareSync(password, user.password_digest);

            if (isAuthed) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          } else {
            return done(null, false);
          }
        });
    })
  );
}


module.exports = Passport;
/////////////////////////////////////////////////////////////
// AUTH SERVICE - handles redirects due to authentication
// TAKEN FROM TIMS
//////////////////////////////////////////////////////////////
const AuthService = {};

AuthService.redirect = (req, res, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

AuthService.restrict = (req, res, next) => {
  if (req.isAthenticated()) {
    next();
  } else {
    res.json({
      error: 'No Acess'
    });
  }
}

AuthService.redirectUser = (req, res, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    const username = req.user.name;
    res.redirect('/user/feed/');
  } else {
    next();
  }
}

module.exports = AuthService;
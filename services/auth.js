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

module.exports = AuthService;
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
    res.redirect('/user/profile/');
  } else {
    next();
  }
}

module.exports = AuthService;
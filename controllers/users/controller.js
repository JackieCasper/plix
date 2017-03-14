const Users = require('../../models/users');
const passport = require('passport');
const AuthService = require('../../services/auth');
// set up the controller
const controller = {};

controller.showLogin = (req, res) => {

  let sendData = req.flash().error || {};
  if (sendData[0]) {
    sendData = {
      error: sendData[0]
    };
  }


  console.log(sendData);
  res.render('users/login', sendData);
}

controller.login = passport.authenticate(
  'local-login', {
    failureRedirect: '/user/login',
    successRedirect: '/user/feed',
    failureFlash: true
  }
);

controller.showNew = (req, res) => {
  let sendData = req.flash().error || {};
  if (sendData[0]) {
    sendData = {
      error: sendData[0]
    };
  }
  res.render('users/signup', sendData);
}

controller.new = passport.authenticate(
  'local-signup', {
    failureRedirect: '/user/signup',
    successRedirect: '/user/feed',
    failureFlash: true
  }
);


controller.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

controller.showProfile = (req, res) => {
  const name = req.user.name;
  Users
    .findPlixByName(name)
    .then(data => {
      console.log(data);
      const renderData = {
        name: name,
        plix: data[1],
        follow: {
          class: 'nofollow',
          followid: 0
        },
      };
      Users
        .getFollowCount(req.user.id)
        .then(followCount => {
          console.log(followCount);
          renderData.followingCount = followCount[0].following_count || 0;
          renderData.followerCount = followCount[1].follower_count || 0;
          res.render('users/show', renderData);
        })
        .catch(err => console.log(err));

    })
    .catch(err => console.log('ERROR GETTING USER', err));
}

controller.test = (req, res, next) => {
  console.log('test');
  console.log(req.body);
  next();
}

controller.showUser = (req, res) => {
  const name = req.params.name;
  if (name === req.user.name) {
    res.redirect('/user/profile');
  } else {
    Users
      .findPlixByName(name)
      .then(plix => {
        const renderData = {
          name: name,
          userId: req.user.id,
          plix: plix[1],
        }
        Users
          .getFollowCount(plix[0].id)
          .then(followCount => {
            renderData.followingCount = followCount[0].following_count || 0;
            renderData.followerCount = followCount[1].follower_count || 0;
            Users
              .getFollowing(parseInt(req.user.id), parseInt(plix[0].id))
              .then(following => {
                console.log(following);
                if (following) {
                  renderData.follow = {
                    class: 'following',
                    followid: plix[0].id
                  };
                } else {
                  renderData.follow = {
                    class: '',
                    followid: plix[0].id
                  };
                }
                console.log('--------------------------');
                console.log('GOT USER');
                console.log(renderData);
                res.render('users/show', renderData);
              })
              .catch(err => console.log(err));
          })
          .catch(err => {
            console.log(err)
          });
      })
      .catch(err => {
        console.log('----------------------------');
        console.log('ERROR GETTING USER');
        console.log(err);
      });
  }

}


controller.showFollowing = (req, res) => {
  const follow = req.params.following;
  const returnData = {
    name: req.params.name,
    userId: req.user.id,
    followClass: req.params.following
  }
  Users
    .findFollowing(req.params.name, follow)
    .then(followData => {
      returnData.following = followData[0];
      console.log('FOLLOWER DATA', followData);
      Users
        .getFollowCount(followData[1].id)
        .then(followCount => {
          returnData.followingCount = followCount[0].following_count || 0;
          returnData.followerCount = followCount[1].follower_count || 0;
          console.log('FOLLOWER COUNT', followCount);
          if (req.user.id !== followData[1].id) {
            Users
              .getFollowing(req.user.id, followData[1].id)
              .then(following => {
                if (following) {
                  returnData.follow = {
                    class: 'following',
                    followid: followData[1].id
                  };
                } else {
                  returnData.follow = {
                    class: '',
                    followid: followData[1].id
                  };
                }
                res.render('users/showfollowing', returnData);
              })
              .catch(err => console.log(err));
          } else {
            returnData.follow = {
              class: 'nofollow',
              followid: 0
            }
            res.render('users/showfollowing', returnData);
          }


        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

controller.showFeed = (req, res) => {
  const renderData = {
    name: req.user.name
  }
  const userId = req.user.id;
  Users
    .getFollowCount(userId)
    .then(followCount => {
      renderData.followingCount = followCount[0].following_count || 0;
      renderData.followerCount = followCount[1].follower_count || 0;
      Users
        .getFeed(userId, 0)
        .then(plix => {
          console.log('PLIX ARRAY---------------', plix);
          renderData.plix = plix;
          console.log('renderData ---> ', renderData);
          res.render('users/feed', renderData);
        })
        .catch(err => console.log(err));

    })
    .catch(err => console.log(err));
}

controller.findUsers = (req, res) => {
  res.render('users/search');
}


module.exports = controller;
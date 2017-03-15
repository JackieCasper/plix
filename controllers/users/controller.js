/////////////////////////////////////////////////////
// USER CONTROLLER
/////////////////////////////////////////////////////

// get model
const Users = require('../../models/users');

// pasport to handle local login and local sign up
const passport = require('passport');

// set up the controller
const controller = {};

// to show the login page
controller.showLogin = (req, res) => {
  // get error if any
  let sendData = req.flash().error || {};
  if (sendData[0]) {
    sendData = {
      error: sendData[0]
    };
  }
  // render page with error if any
  res.render('users/login', sendData);
}

// handle login
controller.login = passport.authenticate(
  'local-login', {
    failureRedirect: '/user/login', // if it fails, redirect to login
    successRedirect: '/user/feed', // if it succeeds go to feed
    failureFlash: true // use flash
  }
);

// to show the signup page
//controller.showNew = (req, res) => {
//  let sendData = req.flash().error || {};
//  if (sendData[0]) {
//    sendData = {
//      error: sendData[0]
//    };
//  }
//  res.render('users/signup', sendData);
//}

// handle signup
controller.new = passport.authenticate(
  'local-signup', {
    failureRedirect: '/', // if it fails, redirect to home
    successRedirect: '/user/feed', // if it succeeds go to feed
    failureFlash: true // use flash
  }
);

// handle logout - log out and redirect
controller.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

// to show a user's profile
controller.showProfile = (req, res) => {
  // get the name
  const name = req.user.name;

  // get promise to find plix by name
  Users
    .findPlixByName(name)
    .then(data => {
      // start building data object - name, photo, plix, user id, follow
      const renderData = {
        name: name,
        photo: req.user.profile_img,
        plix: data[1],
        userId: req.user.id,
        follow: {
          class: 'nofollow',
          followid: 0
        },
      };

      // get promise to get follow count
      Users
        .getFollowCount(req.user.id)
        .then(followCount => {
          // set follow count in render data
          renderData.followingCount = followCount[0].following_count || 0;
          renderData.followerCount = followCount[1].follower_count || 0;
          // render page
          res.render('users/show', renderData);
        })
        .catch(err => console.log(err));

    })
    .catch(err => console.log('ERROR GETTING USER', err));
}

// used when setting up different body parsers. 
// just logs the body
//controller.test = (req, res, next) => {
//  console.log('test');
//  console.log(req.body);
//  next();
//}


// to show a user's profile - not the viewer's
controller.showUser = (req, res) => {
  // get the name of the profile user
  const name = req.params.name;

  // if its the viewer's profile, redirect
  if (name === req.user.name) {
    res.redirect('/user/profile');

  } else { // if its not the viewer's profile
    Users
    // get promise to get plix by username
      .findPlixByName(name)
      .then(plix => {
        // start setting up render data
        const renderData = {
          name: name,
          userId: req.user.id,
          photo: plix[0].profile_img,
          plix: plix[1],
        }
        Users
        // get promise to get the follow count
          .getFollowCount(plix[0].id)
          .then(followCount => {
            // set the follow count in the render data
            renderData.followingCount = followCount[0].following_count || 0;
            renderData.followerCount = followCount[1].follower_count || 0;
            Users
            // get promise to get if the viewer is following the user
              .getFollowing(parseInt(req.user.id), parseInt(plix[0].id))
              .then(following => {

                if (following) { // they are following
                  // set render data
                  renderData.follow = {
                    class: 'following',
                    followid: plix[0].id
                  };
                } else { // they aren't following
                  // set the render data
                  renderData.follow = {
                    class: '',
                    followid: plix[0].id
                  };
                }
                // render the page
                res.render('users/show', renderData);
                // catch all the errors
              })
              .catch(err => console.log(err));
          })
          .catch(err => {
            console.log(err)
          });
      })
      .catch(err => {
        console.log(err);
      });
  }
}

// to show who is following
controller.showFollowing = (req, res) => {
  // get if viewing following users or followers
  const follow = req.params.following;
  // set up return data
  const returnData = {
    name: req.params.name,
    userId: req.user.id,
    followClass: req.params.following
  }
  Users
  //get promise to find 
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
/////////////////////////////////////////////////////
// USER API CONTROLLER
/////////////////////////////////////////////////////

// get model
const Users = require('../../../models/users');

// set up the controller
const controller = {};

//====================================================
// VALIDATION - HAVEN'T IMPLIMENTED IT YET

//// validator - validates data
//const validator = require('validator');
//
//// validate form
//controller.validate = (req, res) => {
//  
//  // set up obj to keep all messages
//  const responceData = {};
//  
//  // get name, email, password
//  const name = req.body.username;
//  const email = req.body.email;
//  const password = req.body.password;
//  
//  // if the name is too short
//  if (name.length < 4) {
//    // set error
//    responceData.username = {
//      status: 'error',
//      error: 'Username needs to be at least 3 characters long'
//    }
//    
//    // if the name has spaces or special characters
//  } else if (!validator.isAlphanumeric(name) || name.includes(' ')) {
//    // set error
//    responceData.username = {
//      status: 'error',
//      error: 'Username cannot contain spaces or special characters'
//    }
//  }
//  
//  // if the password is too short
//  if (password.length < 6) {
//    // set error
//    responceData.password = {
//      status: 'error',
//      error: 'Password needs to be at least 6 characters long'
//    };
//    // otherwise set as ok
//  } else {
//    responceData.password = {
//      status: 'ok',
//      error: ''
//    }
//  }
//  
//  // if the email isn't a valid email
//  if (!validator.isEmail(email)) {
//    responceData.email = {
//      status: 'error',
//      error: 'Please enter a valid email address'
//    }
//  }
//  
//  // checking if name or email exists
//  Users
//    .exists(name, email)
//    .then(data => {
//    
//      // if there isn't already an error for the username and
//      // there is a user by the inputted name
//      if (data[0] && !responceData.username) {
//        // set error
//        responceData.username = {
//          status: 'error',
//          error: 'Username already exists'
//        }
//        // if there isn't a user by that name and there are
//        // no other errors
//      } else if (!data[0] && !responceData.username) {
//        // set response to ok
//        responceData.username = {
//          status: 'ok',
//          error: ''
//        }
//      }
//    // if there are no errors for the email and
//    // the email is in use
//      if (data[1] && !responceData.email) {
//        // set error
//        responceData.email = {
//          status: 'error',
//          error: 'Email already in use'
//        }
//        // if the email isn't in use
//      } else if (!data[1] && !responceData.email) {
//        // set ok
//        responceData.email = {
//          status: 'ok',
//          error: ''
//        }
//      }
//      // send back errors
//      res.json({
//        errors: responceData
//      });
//    })
//    .catch(err => console.log(err));
//}
//
//
//// to validate a single input
//controller.validateInput = (req, res) => {
//  // get input type and value
//  const inputType = req.params.input;
//  const inputValue = req.body.value;
//  
//  // set default to ok
//  let responceData = {
//    status: 'ok',
//    error: ''
//  }
//  
//  // if it is a name
//  if (inputType === 'name') {
//    // if it is too short
//    if (inputValue.length < 4) {
//      // set error
//      responceData = {
//        status: 'error',
//        error: 'Username needs to be at least 3 characters long'
//      }
//      // check if it has special characters or spaces
//    } else if (!validator.isAlphanumeric(inputValue) || inputValue.includes(' ')) {
//      // set error
//      responceData = {
//        status: 'error',
//        error: 'Username cannot contain spaces or special characters'
//      }
//    }
//    // check if it exists
//    Users
//      .nameExists(inputValue)
//      .then((data) => {
//        if (data && responceData.status !== 'ok') {
//          // set error
//          responceData = {
//            status: 'error',
//            error: 'Username already exists'
//          }
//        }
//      //send response
//        res.json({
//          error: responceData
//        });
//      })
//      .catch(err => console.log(err));
//    
//    // if its an email
//  } else if (inputType === 'email') {
//    // if the email is not valid
//    if (!validator.isEmail(email)) {
//      // set error
//      responceData = {
//        status: 'error',
//        error: 'Please enter a valid email address'
//      }
//    }
//    // check if it exists
//    Users
//      .emailExists(inputValue)
//      .then(data => {
//        if (data && responceData.status !== 'ok') {
//          // set error
//          responceData = {
//            status: 'error',
//            error: 'Email already in use'
//          }
//        }
//        // send error
//        res.json({
//          error: responceData
//        });
//      })
//      .catch(err => console.log(err));
//    
//    // if it is a password
//  } else if (inputType === 'password') {
//    // if its too short
//    if (password.length < 6) {
//      // set error
//      responceData = {
//        status: 'error',
//        error: 'Password needs to be at least 6 characters long'
//      }
//    }
//    // send json
//    res.json({
//      error: responceData
//    });
//    // if its something that isn't needed
//  } else {
//    res.send('No matched input');
//  }
//}
// END OF VALIDATION
//==============================================================

// to set following
controller.setFollow = (req, res) => {
  // get ids
  const followData = {
      userId: req.body.userId,
      followId: req.body.followId,
    }
    // if already following
  if (req.body.follow === 'following') {
    // unfollow
    Users
      .unfollow(followData.userId, followData.followId)
      //send data
      .then(data => {
        res.send('followed');
      })
      .catch(err => console.log(err));
    // if not following
  } else {
    // follow
    Users
      .follow(followData.userId, followData.followId)
      .then(() => {
        // send data
        res.send('unfollowed');
      })
      .catch(err => console.log(err));
  }
}

// search for user
controller.search = (req, res) => {
  // get keyword
  const keyword = req.body.keyword.toUpperCase();
  // get search promise
  Users
    .search(keyword)
    .then(results => {
      // send data
      res.json({
        results: results
      });
    })
    .catch(err => {
      console.log(err);
    })
}

// set profile image
controller.setProfile = (req, res) => {
  // get promise to set image
  Users
    .setProfile(req.body.img, req.params.name)
    .then(() => {
      // send response 
      res.send('profile set');
    })
    .catch(err => {
      console.log(err);
      res.send('profile not set');
    })
}

// export
module.exports = controller;
const Users = require('../../../models/users');

// set up the controller
const controller = {};

const validator = require('validator');

controller.validate = (req, res) => {
  const responceData = {};
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  if (name.length < 3) {
    responceData.username = {
      status: 'error',
      error: 'Username needs to be at least 3 characters long'
    }
  } else if (!validator.isAlphanumeric(name) || name.includes(' ')) {
    responceData.username = {
      status: 'error',
      error: 'Username cannot contain spaces or special characters'
    }
  }
  if (password.length < 6) {
    responceData.password = {
      status: 'error',
      error: 'Password needs to be at least 6 characters long'
    };
  } else {
    responceData.password = {
      status: 'ok',
      error: ''
    }
  }
  if (!validator.isEmail(email)) {
    responceData.email = {
      status: 'error',
      error: 'Please enter a valid email address'
    }
  }
  Users
    .exists(name, email)
    .then(data => {
      console.log(data);
      if (data[0] && !responceData.username) {
        responceData.username = {
          status: 'error',
          error: 'Username already exists'
        }
      } else if (!data[0] && !responceData.username) {
        responceData.username = {
          status: 'ok',
          error: ''
        }
      }

      if (data[1] && !responceData.email) {
        responceData.email = {
          status: 'error',
          error: 'Email already in use'
        }
      } else if (!data[1] && !responceData.email) {
        responceData.email = {
          status: 'ok',
          error: ''
        }
      }
      res.json({
        errors: responceData
      });
    })
    .catch(err => console.log(err));
}

controller.validateInput = (req, res) => {
  const inputType = req.params.input;
  const inputValue = req.body.value;
  let responceData = {
    status: 'ok',
    error: ''
  }
  if (inputType === 'name') {
    if (inputValue.length < 3) {
      responceData = {
        status: 'error',
        error: 'Username needs to be at least 3 characters long'
      }
    } else if (!validator.isAlphanumeric(inputValue) || inputValue.includes(' ')) {
      responceData = {
        status: 'error',
        error: 'Username cannot contain spaces or special characters'
      }
    }
    Users
      .nameExists(inputValue)
      .then((data) => {
        if (data && responceData.status !== 'ok') {
          responceData = {
            status: 'error',
            error: 'Username already exists'
          }
        }
        res.json({
          error: responceData
        });
      })
      .catch(err => console.log(err));
  } else if (inputType === 'email') {
    if (!validator.isEmail(email)) {
      responceData = {
        status: 'error',
        error: 'Please enter a valid email address'
      }
    }
    Users
      .emailExists(inputValue)
      .then(data => {
        if (data && responceData.status !== 'ok') {
          responceData = {
            status: 'error',
            error: 'Email already in use'
          }
        }
        res.json({
          error: responceData
        });
      })
      .catch(err => console.log(err));
  } else if (inputType === 'password') {
    if (password.length < 6) {
      responceData = {
        status: 'error',
        error: 'Password needs to be at least 6 characters long'
      }
    }
    res.json({
      error: responceData
    });
  } else {
    res.send('No matched input');
  }
}

controller.setFollow = (req, res) => {
  const followData = {
    userId: req.body.userId,
    followId: req.body.followId,
  }
  if (req.body.follow === 'following') {
    Users
      .unfollow(followData.userId, followData.followId)
      .then(data => {
        res.send('followed');
      })
      .catch(err => console.log(err));
  } else {
    Users
      .follow(followData.userId, followData.followId)
      .then(() => {
        res.send('unfollowed');
      })
      .catch(err => console.log(err));
  }
}

controller.search = (req, res) => {
  const keyword = req.body.keyword.toUpperCase();
  console.log(keyword);
  Users
    .search(keyword)
    .then(results => {
      res.json({
        results: results
      });
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports = controller;
/////////////////////////////////////////////////////////////////
// MAIN FRONT END JS - SETS UP PAGE AND TIES EVERYTHING TOGETHER
/////////////////////////////////////////////////////////////////

// init the page using the api key
var initPage = function (key) {
  var texts = ['Exploring', 'Sharing', 'Connecting'];
  var currentText = 0;
  var $feedContainer = $('.show-feed-container');
  var $plixContainer = $('.plix-container');
  var $followContainer = $('.follow-container');
  var $followList = $('.following-list');
  var $feeds = $('.feed-plix');
  var $plixItem = $('.plix-list-item');
  var $plixShowImg = $('.plix-show-img');
  var description = $('.show-description-edit').val();

  // if there is a map
  if (typeof map != 'undefined' && typeof google != 'undefined') {
    // init the map
    map.init(key);
  }

  // if there is a nav
  if (typeof Nav != 'undefined') {
    // init the nav
    Nav.init();
  }

  //Landing page rotate text
  //===================================

  // function to get the next in the list or the first if its the last
  var getNextText = function () {
      currentText = currentText + 1 === texts.length ? 0 : currentText + 1;
      return texts[currentText];
    }
    // function to rotate the text
  var rotateText = function () {
      // add the class
      var $rotate = $('.rotate')
        .addClass('rotate-out');
      // set time out to remove it and change the class
      setTimeout(function () {
        $rotate
          .text(getNextText())
          .removeClass('rotate-out');
        setTimeout(function () {
          rotateText();
        }, 3000);
      }, 500);
    }
    // init the rotate text
  setTimeout(function () {
    rotateText()
  }, 3000);
  //=====================================
  //end of rotate text

  // hide the hints for the landing page inputs to start
  $('.input-info').hide();
  // when focused on one of those inputs
  $('.login-input').on('focusin', function (e) {
    // show the hint
    $(e.target).parent().children('label').children('.input-info').show();
  });
  // when stop focusing
  $('.login-input').on('focusout', function (e) {
    // hide the hint
    $(e.target).parent().children('label').children('.input-info').hide();
  });

  // function to set the link on a profile picture to its plix
  var setProfileLink = function () {
      // get the image src
      var profImgSrc = $('.profile-img').attr('src');
      // i need to find the plix id
      var plixId;
      // get user id
      var userId = $('.follow-button').attr('data-follow-id');
      // if its not the default
      if (profImgSrc && !profImgSrc.includes('defaultprofile')) {
        // parsing the link to get the plix id from it
        plixId = profImgSrc.split('thumb-')[1].split('-')[1].split('.')[0];
        // set the link href
        $('.profile-link').attr('href', `/plix/${userId}/${plixId}`);
      }
    }
    // call the set profile link
  setProfileLink();

  // function to set a profile image
  var setProfileImage = function () {
    // get user name and thumb of the current plix
    var username = $('#username').attr('data-name');
    var thumb = $('.plix-show-img').attr('data-thumb');
    // do ajax
    $.ajax({
      url: `/api/users/${username}/setprofile`,
      type: 'POST',
      data: {
        img: thumb
      },
      // on success
      success: function (res) {
        // change the make profile button
        $('#make-profile')
          .addClass('is-profile')
          .text('Profile Image');
      },
      error: function (err) {
        console.log(err);
        // add the event listener again
        $('#make-profile').one('click', function (e) {
          setProfileImage();
        })
      }
    })
  }

  // event listener to make profile picture
  $('#make-profile').one('click', function () {
    setProfileImage();
  })

  // Rendering an informative message when there is nothing to display
  //===================================================================
  var renderNoResults = function ($container, text, link, linkText) {
    // create container
    var $noContainer = $('<div>', {
        class: 'no-result-container'
      })
      .appendTo($container);

    // create the sad face
    var $noImg = $('<img>', {
        class: 'no-result-img',
        src: '/img/sad.svg'
      })
      .appendTo($noContainer);

    // create the text
    var $noText = $('<p>', {
        class: 'no-result-text'
      })
      .text(text)
      .appendTo($noContainer);

    // create the link
    var $noLink = $('<a>', {
        href: link,
        class: 'no-result-link'
      })
      .text(linkText)
      .appendTo($noContainer);
  }

  // if there is nothing in the feed
  if ($feedContainer.children().length === 0) {
    renderNoResults($feedContainer, 'No one has shared anything.', '/user/find', 'Follow more people.');
  }

  // if there is nothing in a plix container 
  if ($plixContainer.children().length === 0 && !window.location.pathname.includes('locations')) {
    // if its the user's profile
    if (window.location.pathname.includes('profile')) {
      renderNoResults($plixContainer, `You have no Plix.`, '/plix/new', 'Share one now.');
    } else { // if its a different user
      var name = $('#user').text();
      renderNoResults($plixContainer, `${name} has no plix.`, '/user/feed', 'Find out what others are up to.')
    }
  }

  //=====================================================
  // End of no results section


  //Handle stuff for following
  //=======================================================
  // if its the viewer's page, the follow button will have a class of no follow
  $('.nofollow').parent().remove();
  if ($followList.children().length === 0) {
    if ($followContainer.hasClass('following')) {
      renderNoResults($followList, `You're not following anyone.`, '/user/find', 'Find more people');
    } else {
      renderNoResults($followList, `No one is following you.`);
    }
  }

  // add click listener to follow
  var addFollowClick = function () {
    $('.follow-button').one('click', function (e) {
      var $follow = $(e.target);
      var followData = {
        userId: $('#user').attr('data-user-id'),
        followId: $follow.attr('data-follow-id'),
        follow: ''
      }
      if ($follow.hasClass('following')) {
        followData.follow = 'following';
      }
      $.ajax({
        url: '/api/users/follow',
        type: 'POST',
        data: followData,
        success: function (res) {
          window.location.reload();
        },
        error: function (err) {
          addFollowClick();
          console.log(err);
        }
      })
    })
  }
  addFollowClick();


  // set the feed height to the width
  $feeds.height($feeds.width());
  $('.feed-info-container>.feed-plix').remove();



  $plixItem.height($plixItem.width());
  $(window).resize(function () {
    $plixItem = $('.plix-list-item');
    $plixItem.height($plixItem.width());
    $feeds.height($feeds.width());
  })

  // validate plix upload image
  $('#plix-img').change(function () {
    plixUpload.validate(this);
  });
  // check description on key up
  $('.plix-description').keyup(function () {
    plixUpload.descriptionCheck();
  });


  // set the show image of the plix to the right size
  $plixShowImg.one('load', function () {
    if ($plixShowImg.width() > $plixShowImg.height()) {
      $('.plix-img-container').height($plixShowImg.height());
    }
  }).each(function () {
    if (this.complete) {
      $(this).load();
    }
  });






  $('.edit-icon').click(function (e) {
    var $textarea = $('.show-description-edit');
    $('.edit-icons')
      .toggleClass('editing');

    if ($textarea.prop('readonly')) {
      $textarea
        .prop('readonly', false)
        .focus();
      $(e.target)
        .one('click', function (e) {
          var plixId = $('.plix-show-container').attr('data-plix-id');
          var editData = {
            description: $textarea.val()
          }
          $.ajax({
            url: '/api/plix/' + plixId,
            type: 'PUT',
            data: editData,
            success: function (data) {
              description = $('.show-description-edit').val();
            },
            error: function (err) {
              console.log(err);
            }
          })
        })
        .text('Submit');
    } else {
      $textarea
        .prop('readonly', true)
        .focusout();
      $(e.target).text('');
    }
  });

  $('.cancel-editing').click(function (e) {
    var $textarea = $('.show-description-edit')
      .prop('readonly', true)
      .focusout()
      .val(description);
    $('.edit-icon').text('');
    $('.edit-icons').removeClass('editing');
  });
  $('.delete-plix').one('click', function () {
    var plixId = $('.plix-show-container').attr('data-plix-id');
    $.ajax({
      url: '/api/plix/' + plixId,
      type: 'DELETE',
      success: function (data) {
        window.location.replace('/user/profile');
      },
      error: function (err) {
        console.log(err);
      }
    })
  })
}
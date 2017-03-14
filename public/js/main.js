var initPage = function (key) {

  if (typeof map != 'undefined' && typeof google != 'undefined') {
    map.init(key);
  }

  if (typeof Nav != 'undefined') {
    Nav.init();
  }


  var setProfileImage = function () {
    var username = $('#username').attr('data-name');
    var thumb = $('.plix-show-img').attr('data-thumb');
    $.ajax({
      url: `/api/users/${username}/setprofile`,
      type: 'POST',
      data: {
        img: thumb
      },
      success: function (res) {
        $('#make-profile')
          .addClass('is-profile')
          .text('Profile Image');
      },
      error: function (err) {
        console.log(err);
        $('#make-profile').one('click', function (e) {
          setProfileImage();
        })
      }
    })
  }

  $('#make-profile').one('click', function () {
    setProfileImage();
  })


  var renderNoResults = function ($container, text, link, linkText) {
    var $noContainer = $('<div>', {
        class: 'no-result-container'
      })
      .appendTo($container);
    var $noImg = $('<img>', {
        class: 'no-result-img',
        src: '/img/sad.svg'
      })
      .appendTo($noContainer);
    var $noText = $('<p>', {
        class: 'no-result-text'
      })
      .text(text)
      .appendTo($noContainer);
    var $noLink = $('<a>', {
        href: link,
        class: 'no-result-link'
      })
      .text(linkText)
      .appendTo($noContainer);
  }

  var texts = ['Exploring', 'Sharing', 'Connecting'];
  var currentText = 0;
  var getNextText = function () {
    currentText = currentText + 1 === texts.length ? 0 : currentText + 1;
    return texts[currentText];
  }
  var rotateText = function () {
    var $rotate = $('.rotate')
      .addClass('rotate-out');
    setTimeout(function () {
      $rotate
        .text(getNextText())
        .removeClass('rotate-out');
      setTimeout(function () {
        rotateText();
      }, 3000);
    }, 500);
  }

  setTimeout(function () {
    rotateText()
  }, 3000);

  $('.input-info').hide();

  $('.login-input').on('focusin', function (e) {
    $(e.target).parent().children('label').children('.input-info').show();
  });

  $('.login-input').on('focusout', function (e) {
    $(e.target).parent().children('label').children('.input-info').hide();
  });

  var setProfileLink = function () {
    var profImgSrc = $('.profile-img').attr('src');
    var plixId;
    var userId = $('.follow-button').attr('data-follow-id');
    if (profImgSrc && !profImgSrc.includes('defaultprofile')) {
      plixId = profImgSrc.split('thumb-')[1].split('-')[1].split('.')[0];
      $('.profile-link').attr('href', `/plix/${userId}/${plixId}`);
    }
  }

  setProfileLink();




  var $feedContainer = $('.show-feed-container');
  if ($feedContainer.children().length === 0) {
    renderNoResults($feedContainer, 'No one has shared anything.', '/user/find', 'Follow more people.');
  }

  var $plixContainer = $('.plix-container');
  if ($plixContainer.children().length === 0 && !window.location.pathname.includes('locations')) {
    if (window.location.pathname.includes('profile')) {
      renderNoResults($plixContainer, `You have no Plix.`, '/plix/new', 'Share one now.');
    } else {
      var name = $('#username').attr('data-username');
      renderNoResults($plixContainer, `${name} has no plix.`, '/user/feed', 'Find out what others are up to.')
    }
  }
  var $followButton = $('.follow-button');

  $('.nofollow').parent().remove();
  var $followContainer = $('.follow-container');
  var $followList = $('.following-list');
  if ($followList.children().length === 0) {
    if ($followContainer.hasClass('following')) {
      renderNoResults($followList, `You're not following anyone.`, '/user/find', 'Find more people');
    } else {
      renderNoResults($followList, `No one is following you.`);
    }
  }



  var $feeds = $('.feed-plix');
  $feeds.height($feeds.width());
  $('.feed-info-container>.feed-plix').remove();
  var $plixItem = $('.plix-list-item');
  $plixItem.height($plixItem.width());
  $(window).resize(function () {
    $plixItem = $('.plix-list-item');
    $plixItem.height($plixItem.width());
    $feeds.height($feeds.width());
  })

  $('#plix-img').change(function () {
    plixUpload.validate(this);
  });
  $('.plix-description').keyup(function () {
    plixUpload.descriptionCheck();
  });

  var $plixShowImg = $('.plix-show-img');
  $plixShowImg.one('load', function () {
    if ($plixShowImg.width() > $plixShowImg.height()) {
      $('.plix-img-container').height($plixShowImg.height());
    }
  }).each(function () {
    if (this.complete) {
      $(this).load();
    }
  });


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



  var description = $('.show-description-edit').val();
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
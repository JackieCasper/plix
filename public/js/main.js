const initPage = function (key) {

  if (typeof map != 'undefined') {
    map.init(key);
  }

  if (typeof Nav != 'undefined') {
    Nav.init();
  }
  let $plixItem = $('.plix-list-item');
  $plixItem.height($plixItem.width());
  $(window).resize(function () {
    $plixItem = $('.plix-list-item');
    $plixItem.height($plixItem.width());
  })

  $('#plix-img').change(function () {
    plixUpload.validate(this);
  });
  $('.plix-description').keyup(function () {
    plixUpload.descriptionCheck();
  });

  const $plixShowImg = $('.plix-show-img');
  if ($plixShowImg.width() > $plixShowImg.height()) {
    $('.plix-img-container').height($plixShowImg.height());
  }

  let description = $('.show-description-edit').val();
  $('.edit-icon').click(function (e) {
    const $textarea = $('.show-description-edit');
    $('.edit-icons')
      .toggleClass('editing');

    if ($textarea.prop('readonly')) {
      $textarea
        .prop('readonly', false)
        .focus();
      $(e.target)
        .one('click', function (e) {
          const plixId = $('.plix-show-container').attr('data-plix-id');
          const editData = {
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
    const $textarea = $('.show-description-edit')
      .prop('readonly', true)
      .focusout()
      .val(description);
    $('.edit-icon').text('');
    $('.edit-icons').removeClass('editing');
  });
  $('.delete-plix').one('click', function () {
    const plixId = $('.plix-show-container').attr('data-plix-id');
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
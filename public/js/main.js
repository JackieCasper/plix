const initPage = (key) => {
  if (typeof map != 'undefined') {
    map.init(key);
  }

  if (typeof Nav != 'undefined') {
    Nav.init();
  }
  let $plixItem = $('.plix-list-item');
  $plixItem.height($plixItem.width());
  $(window).resize(() => {
    $plixItem = $('.plix-list-item');
    $plixItem.height($plixItem.width());
  })

  $('#plix-img').change(function () {
    plixUpload.validate(this);
  });
  $('.plix-description').keyup(() => {
    plixUpload.descriptionCheck();
  });

  const $plixShowImg = $('.plix-show-img');
  if ($plixShowImg.width() > $plixShowImg.height()) {
    $('.plix-img-container').height($plixShowImg.height());
  }


  $('.edit-icon').click((e) => {
    const $textarea = $('.show-description-edit');
    $('.edit-icons')
      .toggleClass('editing');

    if ($textarea.prop('readonly')) {
      $textarea
        .prop('readonly', false)
        .focus();
      $(e.target)
        .one('click', (e) => {
          const plixId = $('.plix-show-container').attr('data-plix-id');
          const editData = {
            description: $textarea.val()
          }
          $.ajax({
            url: '/api/plix/' + plixId,
            type: 'PUT',
            data: editData,
            success: (data) => {
              console.log(data);
            },
            error: err => console.log(err)
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
}
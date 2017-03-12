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
  })
  const $plixShowImg = $('.plix-show-img');
  if ($plixShowImg.width() > $plixShowImg.height()) {
    $('.plix-img-container').height($plixShowImg.height());
  }
  $('.edit-icon').click((e) => {
    $(e.target)
      .toggleClass('editing')
      .text('Submit')
      .one('click', (e) => {
        console.log('submit edit');
      });
    const $textarea = $('.show-description-edit');
    if ($textarea.prop('disabled')) {
      $textarea
        .removeProp('disabled')
        .focusin();
    } else {
      $textarea
        .prop('disabled', true)
        .focusout();
    }
  })
}
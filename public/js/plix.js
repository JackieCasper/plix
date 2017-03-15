/////////////////////////////////////////////////////
// FRONT END PLIX JS - helps get and render plix
/////////////////////////////////////////////////////

var Plix = {};

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

Plix.renderPlixList = function (plixes) {
  var $plixContainer = $('.plix-container').empty();
  if (plixes.plix) {
    plixes = plixes.plix;

  }
  if (plixes.length === 0) {
    renderNoResults($plixContainer, 'No Plix in this area', '/plix/new', 'Share one now.')
  } else {
    plixes.forEach(function (plix) {
      var $plixThumb = $('<a>', {
          href: `/plix/${plix.username}/${plix.id}`,
          class: 'plix-list-item'
        })
        .css('background-image', `url(${plix.thumb})`)
        .appendTo($plixContainer);

      $plixThumb.height($plixThumb.width());
    })
  }



}

Plix.getNearbyPlix = function (lat, lng, distance) {
  console.log(map.currentPlace);
  var nearbyReqData = {
    lat, lng, distance
  };
  $.ajax({
    url: '/api/locations/nearbyPlix',
    type: 'POST',
    data: nearbyReqData,
    success: function (data) {
      console.log(data);
      Plix.renderPlixList(data);
    },
    error: function (err) {
      console.log('ERROR GETTING NEARBY', err);
    }
  })
}
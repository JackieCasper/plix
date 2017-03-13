var Plix = {};

Plix.renderPlixList = function (plixes) {
  var $plixContainer = $('.plix-container').empty();
  if (plixes.plix) {
    plixes = plixes.plix;
  }
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
const Plix = {};

Plix.renderPlixList = function (plixes) {
  const $plixContainer = $('.plix-container').empty();
  if (plixes.plix) {
    plixes = plixes.plix;
  }
  plixes.forEach(function (plix) {
    const $plixThumb = $('<a>', {
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
  const nearbyReqData = {
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
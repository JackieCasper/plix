const Plix = {};
//<a href="/plix/show/{{id}}" class="plix-list-item" style="background-image:url({{thumb}})"></a>
Plix.renderPlixList = (plixes) => {
  const $plixContainer = $('.plix-container').empty();
  if (plixes.plix) {
    plixes = plixes.plix;
  }
  plixes.forEach(plix => {
    const $plixThumb = $('<a>', {
        href: `/plix/${plix.username}/${plix.id}`,
        class: 'plix-list-item'
      })
      .css('background-image', `url(${plix.thumb})`)
      .appendTo($plixContainer);

    $plixThumb.height($plixThumb.width());
  })
}

Plix.getNearbyPlix = (lat, lng, distance) => {
  console.log(map.currentPlace);
  const nearbyReqData = {
    lat, lng, distance
  };
  $.ajax({
    url: '/api/locations/nearbyPlix',
    type: 'POST',
    data: nearbyReqData,
    success: data => {
      console.log(data);
      Plix.renderPlixList(data);
    },
    error: err => console.log('ERROR GETTING NEARBY', err)
  })
}
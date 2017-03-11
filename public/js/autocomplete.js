const autocomplete = {};

// init the autocomplete on the search bar
autocomplete.init = (key) => {
  //  autocomplete.service = new google.maps.places.AutocompleteService();
  //  $('#autocomplete').change((e) => {
  //    autocomplete.getResults($(e.target).val(), key);
  //  })

};


// get the results from the autocomplete
autocomplete.getResults = (input, key) => {
  const renderResults = (data, key, $results) => {
    data.forEach((prediction, i) => {
      const $placeContainer = $('<div>')
        .appendTo($results);
      autocomplete.getPlaceData(key,
        $placeContainer,
        prediction.place_id,
        i === data.length - 1 ? true : false);
    });
  }
  const parseResults = (predictions, status) => {
    console.log(predictions);
    const $results = $('.results').empty();
    const $loading = $('<p>', {
        class: 'loading'
      })
      .text('loading')
      .appendTo($results);
    if (!predictions[0].place_id) {
      $.ajax({
        url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${map.map.center.lat()},${map.map.center.lng()}&rankby=distance&keyword=${$('#autocomplete').val()}&key=${key}`,
        type: 'GET',
        success: data => {
          console.log(data);
          renderResults(data.results.slice(0, 4), key, $results);
        },
        error: err => {
          console.log(err);
        }
      })
    } else {
      renderResults(predictions, key, $results);
    }

  }
  autocomplete.service.getQueryPredictions({
    input: input
  }, parseResults)
};



// render the search results
autocomplete.renderResult = (place) => {

};

// set autocomplete result -- as geolocation
autocomplete.setResult = (location) => {};

autocomplete.getPlaceData = (key, $container, placeId, last = false) => {

  let url = placeId ? `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${key}` : `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${map.center.lat},${map.center.lng}&rankby=distance&keyword=${description}&key=${key}`
  $.ajax({
    url: url,
    type: 'GET',
    success: data => {
      console.log(data);
      $container.html(data.result.adr_address);
    },
    error: err => {
      console.log(err);
    }
  });

}
const autocomplete = {};

// init the autocomplete on the search bar
autocomplete.init = (key) => {
  autocomplete.service = new google.maps.places.AutocompleteService();
  $('#autocomplete').change((e) => {
    autocomplete.getResults($(e.target).val(), key);
  })
};

// get the results from the autocomplete
autocomplete.getResults = (input, key) => {
  const parseResults = (predictions, status) => {
    console.log(predictions);
    const $results = $('.results').empty();
    const $loading = $('<p>')
      .text('loading')
      .appendTo($results);
    predictions.forEach((prediction, i) => {
      const $placeContainer = $('<div>')
        .appendTo($results);
      autocomplete.getPlaceData(prediction.place_id,
        key,
        $placeContainer,
        i === predictions.length - 1 ? true : false);
    });
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

autocomplete.getPlaceData = (placeId, key, $container, last = false) => {
  $.ajax({
    url: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${key}`,
    type: 'GET',
    success: data => {
      console.log(data);
    },
    error: err => {
      console.log(err);
    }
  });

}
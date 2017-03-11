const map = {};
let autocomplete = {};

// init the map
map.init = (key, location) => {
  const styles = [
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#444444"
            }
        ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#f2f2f2"
            }
        ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "hue": "#00ffd6"
            },
        {
          "saturation": "11"
            },
        {
          "weight": "1.00"
            },
        {
          "lightness": "-4"
            }
        ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "lightness": "0"
            }
        ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
            }
        ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "on"
            },
        {
          "hue": "#00ffb2"
            }
        ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "saturation": -100
            },
        {
          "lightness": 45
            }
        ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "simplified"
            }
        ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
            }
        ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
            }
        ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#54babe"
            },
        {
          "visibility": "on"
            }
        ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "saturation": "-19"
            },
        {
          "lightness": "12"
            }
        ]
    }
];
  const defaultLocation = {
    center: {
      lat: 40.739838299999995,
      lng: -73.9895757
    },
    zoom: 16
  };


  const mapOptions = {
    zoom: 16,
    styles: styles,
    zoomControl: true,
    mapTypeControl: false
  }


  if (navigator.geolocation && !location) {

    navigator.geolocation.getCurrentPosition(function (position) {

      mapOptions.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      map.getPlace(key, mapOptions.center);
      map.search.init(key);

    });
  } else {
    location = location || defaultLocation;
    mapOptions.center = location.center;
    mapOptions.zoom = location.zoom;
    map.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    map.getPlace(key, mapOptions.center);
    map.search.init(key);
  }
};

map.getPlace = (key, location, placeId) => {
  const url = placeId ? `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${key}` : `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${key}`;
  $.ajax({
    url: url,
    method: 'GET',
    success: (data) => {
      map.clearMarkers();
      map.setLocation(data.results[0].geometry.location, data.results[0].formatted_address, data.results[0].place_id);
      map.currentPlace = data.results[0];
      console.log(map.currentPlace);
    },
    error: err => console.log(err)
  })
}

map.search = {};
map.search.init = (key) => {
  map.search.$searchInput = $('#search')
    .keyup(() => {
      if (map.search.$searchInput.val()) {
        map.search.findPlaces(key);
      }
    });
}
map.search.findPlaces = (key) => {
  const searchTerm = map.search.$searchInput.val();
  $.ajax({
    url: `/api/locations/places/keyword`,
    type: 'POST',
    data: {
      lat: map.map.getCenter().lat,
      lng: map.map.getCenter().lng,
      keyword: searchTerm
    },
    success: data => {
      console.log(data);
      map.search.renderPlaceOptions(data.results.slice(0, 5), key);
    },
    error: err => {
      console.log(err);
    }
  });
}

map.markers = [];


map.search.renderPlaceOptions = (places, key) => {
  const $results = $('.results').empty();
  places.forEach(place => {
    const $placeContainer = $('<div>', {
        class: 'place-option'
      })
      .appendTo($results)
      .click(() => {
        map.getPlace(key, place.geometry.location, place.place_id);
        $('.results').empty();
      });
    const $placeIcon = $('<img>', {
        src: '/img/marker.svg',
        class: 'place-option-icon'
      })
      .appendTo($placeContainer);
    const $placeText = $('<p>', {
        class: 'place-option-text'
      })
      .appendTo($placeContainer);
    const $placeName = $('<span>', {
        class: 'place-option-name'
      })
      .text(place.name)
      .appendTo($placeText);
    const $placeAdress = $('<span>', {
        class: 'place-option-address'
      })
      .text(place.vicinity)
      .appendTo($placeText);
  });
}

map.clearMarkers = () => {
  map.markers.forEach(function (marker) {
    marker.setMap(null);
  });
  map.markers = [];
}

map.setLocation = (location, name, placeId) => {
  map.search.$searchInput.val(name);
  map.currentPlace
  map.map.setCenter({
    lat: location.lat,
    lng: location.lng
  });

  map.markers.push(new google.maps.Marker({
    map: map.map,
    title: name,
    position: {
      lat: location.lat,
      lng: location.lng
    }
  }));
  if ($('.plix-form').length) {

    $('#place-id').val(placeId)

  }
}
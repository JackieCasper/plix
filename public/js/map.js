/////////////////////////////////////////////////////
// FRONT END MAP JS - sets up maps
/////////////////////////////////////////////////////

var map = {};
var styles = [
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

// init the map
map.init = function (key, location, placeId) {
  console.log('loading map');
  $('.search-container').hide();
  var defaultLocation = {

    lat: 40.739838299999995,
    lng: -73.9895757

  };


  var mapOptions = {
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
    mapOptions.center = location;

    map.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    if (placeId) {
      map.getPlace(key, mapOptions.center, placeId)
    } else {
      map.getPlace(key, mapOptions.center);
    }
    map.search.init(key);
  }
};

map.getPlace = function (key, location, placeId) {
  console.log('getting place');
  var url = placeId ? `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${key}` : `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${key}`;
  $.ajax({
    url: url,
    method: 'GET',
    contentType: 'multipart/form-data',
    success: function (data) {
      console.log('place got');
      map.clearMarkers();
      map.setLocation(data.results[0].geometry.location, data.results[0].formatted_address, data.results[0].place_id);
      map.currentPlace = data.results[0];
      if (window.location.pathname.includes('locations')) {
        Plix.getNearbyPlix(map.currentPlace.geometry.location.lat, map.currentPlace.geometry.location.lng, 1);
      }
    },
    error: function (err) {
      console.log(err);
    }
  })
}

map.search = {};
map.search.init = function (key) {
  console.log('search init');
  map.search.$searchInput = $('#search')
    .keyup(function () {
      if (map.search.$searchInput.val()) {
        map.search.findPlaces(key);
      }
    })
  $('.search-container').show();
}
map.search.findPlaces = function (key) {
  var searchTerm = map.search.$searchInput.val();
  $.ajax({
    url: `/api/locations/places/keyword`,
    type: 'POST',
    data: {
      lat: map.map.getCenter().lat,
      lng: map.map.getCenter().lng,
      keyword: searchTerm
    },
    success: function (data) {
      console.log(data);
      map.search.renderPlaceOptions(data.results.slice(0, 5), key);
    },
    error: function (err) {
      console.log(err);
    }
  });
}

map.markers = [];



map.search.renderPlaceOptions = function (places, key) {
  var $results = $('.results').empty();

  places.forEach(function (place) {
    var $placeContainer = $('<div>', {
        class: 'place-option'
      })
      .appendTo($results)
      .click(function () {
        map.getPlace(key, place.geometry.location, place.place_id);
        $('.results').empty();
      });
    var $placeIcon = $('<img>', {
        src: '/img/marker.svg',
        class: 'place-option-icon'
      })
      .appendTo($placeContainer);
    var $placeText = $('<p>', {
        class: 'place-option-text'
      })
      .appendTo($placeContainer);
    var $placeName = $('<span>', {
        class: 'place-option-name'
      })
      .text(place.name)
      .appendTo($placeText);
    var $placeAdress = $('<span>', {
        class: 'place-option-address'
      })
      .text(place.vicinity)
      .appendTo($placeText);
  });


}

map.clearMarkers = function () {
  map.markers.forEach(function (marker) {
    marker.setMap(null);
  });
  map.markers = [];
}

map.setLocation = function (location, name, placeId) {
    console.log('setting location');
    map.search.$searchInput.val(name);
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
  //http://jsfiddle.net/s6Dyp/18/
map.setStaticSrc = function (lat, lng, key) {
  console.log(lat, lng, key);
  var src = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&zoom=16&center=${lat},${lng}&format=png&markers=color:red%7C${lat},${lng}&key=${key}&style=feature:administrative|element:labels.text.fill|color:0x444444&style=feature:landscape|element:all|color:0xf2f2f2&style=feature:landscape|element:geometry.fill|hue:0x00ffd6|saturation:11|weight:1.00|lightness:-4&style=feature:landscape.man_made|element:geometry.fill|lightness:0&style=feature:poi|element:all|visibility:off&style=feature:poi.park|element:geometry.fill|visibility:on|hue:0x00ffb2&style=feature:road|element:all|saturation:-100|lightness:45&style=feature:road.highway|element:all|visibility:simplified&style=feature:road.arterial|element:labels.icon|visibility:off&style=feature:transit|element:all|visibility:off&style=feature:water|element:all|color:0x54babe|visibility:on&style=feature:water|element:geometry.fill|saturation:-19|lightness:12`
  $('.static-map').attr('src', src);
  console.log(src);
}
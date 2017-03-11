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
    console.log('LOCATON');
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
      mapOptions.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      map.getPlace(key, mapOptions.center);
      map.search.init();

    });
  } else {
    location = location || defaultLocation;
    mapOptions.center = location.center;
    mapOptions.zoom = location.zoom;
    map.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    map.getPlace(key, mapOptions.center);
    map.search.init();
  }
};

map.getPlace = (key, location) => {
  $.ajax({
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${key}`,
    type: 'GET',
    success: (data) => {
      map.addMarker(data.results[0].geometry.location);
      map.currentPlace = data.results[0];
    },
    error: err => console.log(err)
  })
}

map.search = {};
map.search.init = (key) => {
  map.search.$searchInput = $('#search')
    .change(() => {
      if (map.search.$searchInput.val()) {
        map.search.findPlaces(key);
      }
    });
}
map.search.findPlaces = (key) => {
  const searchTerm = map.search.$searchInput.val();
  $.ajax({
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${map.map.getCenter().lat},${map.map.getCenter().lng}&rankby=distance&type=restaurant&keyword=${searchTerm}&key=${key}`,
    type: 'GET',
    success: data => {
      console.log(data);
    },
    error: err => {
      console.log(err);
    }
  });
}


map.addMarker = (location) => {
  map.map.setCenter({
    lat: location.lat,
    lng: location.lng
  });
}
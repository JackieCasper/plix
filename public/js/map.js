const map = {};

// init the map
map.init = (location) => {
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
    zoom: 18
  };
  location = location || defaultLocation;




  const mapOptions = {
    center: location.center,
    zoom: location.zoom,
    styles: styles,
    zoomControl: true,
    mapTypeControl: false
  }
  map.map = new google.maps.Map(document.getElementById('map'), mapOptions);

  if (navigator.geolocation) {
    console.log('LOCATON');
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.map.setCenter(pos);
    });
  }
};

// center the map on a given point
map.center = (location) => {};

// place a map marker
map.placeMarker = (location) => {};

// clear map markers
map.clearMarkers = () => {};
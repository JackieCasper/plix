const defaultLocation = {
  center: {},
  zoom: '',
};
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
]
const initMap = (location = defaultLocation) => {
  const mapOptions = {
    center: location.center,
    zoom: location.zoom,
    styles: styles,
    zoomControl: true,
    mapTypeControl: false
  }
};

const centerMap = (location) => {};

const placeMarker = (location, marker) => {};

const clearMarkers = () => {};

const initAutoComplete = () => {};

const getAutoComplete = () => {};

const getGeoLocation = () => {
  $.ajax({
    url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAbRXW_Cvax61VTSO3pZNuD82H3C9ct0mQ'
  })
};

// GeoIP - lite https://github.com/bluesmoon/node-geoip
const geoBackup = () => {};
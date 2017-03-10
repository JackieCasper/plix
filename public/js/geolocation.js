const geoLocation = {};

geoLocation.get = (key) => {
  $.ajax({
    url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + key,
    method: 'GET',
    success: data => {
      placeMarker(data.location);
    },
    error: err => console.log(err)
  });
  geoLocation.backup();
};

// GeoIP - lite https://github.com/bluesmoon/node-geoip
geoLocation.backup = () => {
  $.ajax({
    url: '/api/locations/geolocation',
    type: 'GET',
    success: data => {
      console.log(data);
    },
    error: err => console.log(err)
  })
};
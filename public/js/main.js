$(() => {
  let keys;
  const getKeys = () => {
    $.ajax({
      url: '/api/keys',
      method: 'GET',
      success: (data) => {
        keys = data;
        initPage();
      },
      error: err => console.log(err)

    });
  }
  getKeys();

  const initPage = () => {
    if (geoLocation) {
      geoLocation.get(keys.geoLocationKey);
    }
    if (map) {
      map.init();
    }
    if (autocomplete) {
      autocomplete.init(keys.placesKey);
    }
  }



})
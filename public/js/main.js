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
    if (map) {
      map.init(keys.placesKey);
    }
  }


})
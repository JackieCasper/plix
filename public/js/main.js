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
    if (typeof map != 'undefined') {
      map.init(keys.placesKey);
    }
  }
  if (typeof Nav != 'undefined') {
    Nav.init();
  }


})
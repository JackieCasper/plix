$(() => {
  let keys;
  const getKeys = () => {
    $.ajax({
      url: '/api/keys',
      type: 'GET',
      success: (data) => {
        keys = data;
      },
      error: err => console.log(err);

    });
  }

})
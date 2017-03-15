/////////////////////////////////////////////////////
// SEARCH JS - handles front end searching
/////////////////////////////////////////////////////

var Search = {}

Search.init = function () {
  Search.$input = $('#search');
  Search.$input.keyup(function (e) {
    Search.findResults();
  })
}

Search.findResults = function () {
  var keyword = Search.$input.val();
  if (keyword) {
    $.ajax({
      url: '/api/users/search',
      type: 'POST',
      data: {
        keyword: keyword
      },
      success: function (results) {
        console.log(results);
        Search.renderResults(results.results);
      },
      error: function (err) {
        console.log(err);
      }
    })
  } else {
    $('.search-results').empty();
  }
}

Search.renderResults = function (results) {
  var $results = $('.search-results').empty();
  if (results.length === 0) {
    var $container = $('<div>', {
        class: 'no-result-container'
      })
      .appendTo($results);
    var $img = $('<img>', {
        src: '/img/sad.svg',
        class: 'no-result-img'
      })
      .appendTo($container);
    var $text = $('<p>', {
        class: 'no-result-text'
      })
      .text('No users found matching your search.')
      .appendTo($container);

  } else {
    results.forEach(function (result) {
      var $container = $('<a>', {
          class: 'result-container',
          href: '/user/' + result.name
        })
        .appendTo($results);
      var $icon = $('<div>', {
          class: 'result-icon user'
        })
        .appendTo($container);
      var $name = $('<p>', {
          class: 'result-name'
        })
        .text(result.name)
        .appendTo($container);
    })
  }

}

$(document).ready(function () {
  Search.init();
})
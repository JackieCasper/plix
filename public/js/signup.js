//$(document).ready(function () {
//  $('form').submit(function (e) {
//    e.preventDefault();
//    const validateData = {
//      username: $('#name').val(),
//      email: $('#email').val(),
//      password: $('#password').val()
//    }
//    $.ajax({
//      url: '/api/users/validate',
//      type: 'POST',
//      data: validateData,
//      success: function (data) {
//        console.log(data);
//      },
//      error: function (data) {
//        console.log(data);
//      }
//    })
//  })

//  const replaceSpaces = function ($input) {
    //    $($input).val($input.val().replace(/\s/g, ''));
    //  }
    //
    //  $("#name")
    //    .keyup(function (e) {
    //      replaceSpaces($(e.target));
    //    })
    //    .change(function (e) {
    //      replaceSpaces($(e.target));
    //    })


//});// end of document ready
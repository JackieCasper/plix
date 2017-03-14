//https://devcenter.heroku.com/articles/s3-upload-node

var plixUpload = {};

//http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
plixUpload.validate = function (input) {

  if (input.files && input.files[0]) {
    getOrientation(input.files[0], function (orientation) {
      alert('orientation: ' + orientation);
    });
    var reader = new FileReader();
    console.log('Has Files');

    reader.onload = function (e) {
      $('.upload-img').attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);

  }
}

function getOrientation(file, callback) {
  var reader = new FileReader();
  reader.onload = function (e) {

    var view = new DataView(e.target.result);
    if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
    var length = view.byteLength,
      offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++)
          if (view.getUint16(offset + (i * 12), little) == 0x0112)
            return callback(view.getUint16(offset + (i * 12) + 8, little));
      } else if ((marker & 0xFF00) != 0xFF00) break;
      else offset += view.getUint16(offset, false);
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file);
}


plixUpload.descriptionCheck = function () {
  var $description = $('.plix-description');
  var $descriptionLength = $('.description-length').text($description.val().length);

}
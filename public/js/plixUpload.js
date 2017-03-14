//https://devcenter.heroku.com/articles/s3-upload-node

var plixUpload = {};
var imageRotation = false;
var labelWidth = $('.upload-label').width();

$(window).resize(function (e) {
  if (imageRotation && (imageRotation.rotation === 90 || imageRotation.rotation === 270)) {
    $('.upload-img').css({
      height: labelWidth + 'px',
      width: 'auto'
    });
  }
})

//http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
plixUpload.validate = function (input) {
  var Rotation = function (orientation) {
    switch (orientation) {
    case 2:
      this.rotation = 0;
      this.flip = 180;
      break;
    case 3:
      this.rotation = 180;
      this.flip = 0;
      break;
    case 4:
      this.rotation = 180;
      this.flip = 180
      break;
    case 5:
      this.rotation = 90;
      this.flip = 180;
      break;
    case 6:
      this.rotation = 90;
      this.flip = 0;
      break;
    case 7:
      this.rotation = 270;
      this.flip = 180;
      break;
    case 8:
      this.rotation = 270;
      this.flip = 0;
      break;
    default:
      this.rotation = 0;
      this.flip = 0;
    }

    $('.upload-img').css({
      transform: `rotate(${this.rotation}deg)rotateX(${this.flip}deg)`
    })
    if (this.rotation === 270 || this.rotation === 90) {
      $('.upload-img')
        .height(labelWidth)
        .css({
          width: 'auto'
        });
    }
  }



  if (input.files && input.files[0]) {
    getOrientation(input.files[0], function (orientation) {
      alert('orientation: ' + orientation);
      imageRotation = new Rotation(orientation);

      var reader = new FileReader();
      console.log('Has Files');

      reader.onload = function (e) {
        $('.upload-img').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);

    });


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
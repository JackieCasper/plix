//https://devcenter.heroku.com/articles/s3-upload-node

var plixUpload = {};
var imageRotation = false;


$(window).resize(function (e) {
  if (imageRotation && (imageRotation.rotation === 90 || imageRotation.rotation === 270)) {
    $('.upload-img')
      .height($(window).innerWidth() <= 900 ? $(window).innerWidth() : 900)
      .width('auto');
  }
})


plixUpload.validate = function (input) {
    var Rotation = function (orientation, ios) {

      switch (orientation) {
      case 2:
        this.rotation = ios ? 270 : 0;
        this.flip = 180;
        break;
      case 3:
        this.rotation = ios ? 90 : 180;
        this.flip = 0;
        break;
      case 4:
        this.rotation = ios ? 90 : 180;
        this.flip = 180
        break;
      case 5:
        this.rotation = ios ? 0 : 90;
        this.flip = 180;
        break;
      case 6:
        this.rotation = ios ? 0 : 90;
        this.flip = 0;
        break;
      case 7:
        this.rotation = ios ? 180 : 270;
        this.flip = 180;
        break;
      case 8:
        this.rotation = ios ? 180 : 270;
        this.flip = 0;
        break;
      default:
        this.rotation = ios ? 270 : 0;
        this.flip = 0;
      }

      $('.upload-img').css({
        transform: `rotate(${this.rotation}deg)rotateX(${this.flip}deg)`
      })

    }


    //http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
    if (input.files && input.files[0]) {
      getOrientation(input.files[0], function (orientation) {
        console.log('orientation: ' + orientation);
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        alert(iOS);
        imageRotation = new Rotation(orientation, iOS);

        var reader = new FileReader();
        console.log('Has Files');

        reader.onload = function (e) {
          $('.upload-img').attr('src', e.target.result);
          if (imageRotation.rotation === 270 || imageRotation.rotation === 90) {
            $('.upload-img')
              .height($(window).innerWidth() <= 900 ? $(window).innerWidth() : 900)
              .width('auto');
          }
        }

        reader.readAsDataURL(input.files[0]);

      });


    }
  }
  //http://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side
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
//https://devcenter.heroku.com/articles/s3-upload-node

const plixUpload = {};

//http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
plixUpload.validate = (input) => {

  if (input.files && input.files[0]) {
    var reader = new FileReader();
    console.log('Has Files');

    reader.onload = (e) => {
      $('.upload-img').attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);

  }
}

plixUpload.descriptionCheck = () => {
  const $description = $('.plix-description');
  const $descriptionLength = $('.description-length').text($description.val().length);

}
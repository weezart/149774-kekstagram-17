'use strict';
(function () {

  var pictureTemplate = document.querySelector('template').content.querySelector('.picture');

  var renderPicture = function (dataPicture) {
    var picture = pictureTemplate.cloneNode(true);
    picture.setAttribute('tabindex', '0');
    picture.querySelector('.picture__img').src = dataPicture.url;
    picture.querySelector('.picture__likes').textContent = dataPicture.likes;
    picture.querySelector('.picture__comments').textContent = dataPicture.comments.length;

    return picture;
  };

  var insertPictures = function (dataPictures) {
    var pictureFragment = document.createDocumentFragment();
    var pictures = document.querySelector('.pictures');
    for (var i = 0; i < dataPictures.length; i++) {
      var picture = renderPicture(dataPictures[i]);
      window.handlers.addPictureOpenHandlers(picture, dataPictures[i]);
      pictureFragment.appendChild(picture);
    }
    pictures.appendChild(pictureFragment);
  };

  var onSuccessLoad = function (data) {
    window.data.pictures = data;
    insertPictures(window.data.pictures);
  };

  window.backend.load(onSuccessLoad, window.backend.onError);
})();

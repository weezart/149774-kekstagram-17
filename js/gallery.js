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
      window.gallery.items[i] = renderPicture(dataPictures[i]);
      window.handlers.addPictureOpenHandlers(window.gallery.items[i], dataPictures[i]);
      pictureFragment.appendChild(window.gallery.items[i]);
    }
    pictures.appendChild(pictureFragment);
    window.filters.activate();
  };

  var onSuccessLoad = function (data) {
    window.data.pictures = data;
    insertPictures(window.data.pictures);
    window.filters.init();
  };

  window.backend.load(onSuccessLoad, window.backend.onError);

  window.gallery = {
    items: [],
    clean: function () {
      this.items.forEach(function (item) {
        item.remove();
      });
      this.length = 0;
    },
    fill: function (data) {
      insertPictures(data);
    }
  };
})();

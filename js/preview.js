'use strict';

(function () {
  var preview = document.querySelector('.big-picture');
  var previewClose = preview.querySelector('.big-picture__cancel');

  window.preview = {
    status: false,
    show: function (dataPicture) {
      preview.classList.remove('hidden');
      preview.querySelector('.big-picture__img img').src = dataPicture.url;
      preview.querySelector('.likes-count').textContent = dataPicture.likes;
      preview.querySelector('.comments-count').textContent = dataPicture.comments.length;
      window.handlers.onPopupClickClose(previewClose);
      this.status = true;
    },
    hide: function () {
      preview.classList.add('hidden');
      previewClose.removeEventListener('keydown', window.handlers.onPopupCloseEnterPress);
      this.status = false;
    }
  };
})();

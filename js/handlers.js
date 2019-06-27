'use strict';

(function () {
  var closePopup = function () {
    if (window.preview.status) {
      window.preview.hide();
    }
    if (window.form.status) {
      window.form.hide();
    }
  };

  window.handlers = {
    addPictureOpenHandlers: function (picture, dataPicture) {
      picture.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.preview.show(dataPicture);
      });
      picture.addEventListener('keydown', function (evt) {

        if (evt.keyCode === ENTER_KEYCODE) {
          window.preview.show(dataPicture);
        }
      });
    },
    onPopupCloseEnterPress: function (evt) {
      window.utils.isEnterEvent(evt, closePopup);
    },
    onPopupEscPress: function (evt) {
      window.utils.isEscEvent(evt, closePopup);
    },
    onPopupClickClose: function (elem) {
      document.addEventListener('keydown', window.handlers.onPopupEscPress);
      elem.addEventListener('keydown', window.handlers.onPopupCloseEnterPress);
      elem.addEventListener('click', function () {
        closePopup();
        document.removeEventListener('keydown', window.handlers.onPopupEscPress);
      });
    }
  };
})();

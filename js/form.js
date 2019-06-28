'use strict';
(function () {
  var PICTURE_RESIZE_STEP = 25;
  var PICTURE_MIN_SIZE = 25;
  var PICTURE_MAX_SIZE = 100;
  var DEC = 10;
  var DESCRIPTION_MAX_LENGTH = 140;
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';

  var resizePicture = function () {
    sizeValue.value = '100%';
    previewImage.style.removeProperty('transform');

    sizeDec.addEventListener('click', function () {
      var pictureSize = parseInt(sizeValue.value, DEC) - PICTURE_RESIZE_STEP;

      if (pictureSize >= PICTURE_MIN_SIZE) {
        sizeValue.value = pictureSize + '%';
        previewImage.style.transform = 'scale(' + pictureSize / PICTURE_MAX_SIZE + ')';
      }
    });

    sizeInc.addEventListener('click', function () {
      var pictureSize = parseInt(sizeValue.value, DEC) + PICTURE_RESIZE_STEP;

      if (pictureSize <= PICTURE_MAX_SIZE) {
        sizeValue.value = pictureSize + '%';
        previewImage.style.transform = 'scale(' + pictureSize / PICTURE_MAX_SIZE + ')';
      }
    });
  };

  var changeEffects = function () {
    var effects = imageEffects.querySelectorAll('.effects__radio');

    for (var i = 0; i < effects.length; i++) {
      if (effects[i].checked) {
        imageEffectLevelSlider.classList.remove('hidden');
        var effectLevelValue = imageEffectDepth.offsetWidth / imageEffectLevel.offsetWidth;
        imageEffectLevelInput.value = parseInt(effectLevelValue * 100, DEC);
        switch (effects[i].value) {
          case 'chrome':
            previewImage.style.filter = 'grayscale(' + effectLevelValue + ')';
            break;
          case 'sepia':
            previewImage.style.filter = 'sepia(' + effectLevelValue + ')';
            break;
          case 'marvin':
            previewImage.style.filter = 'invert(' + effectLevelValue * 100 + '%)';
            break;
          case 'phobos':
            previewImage.style.filter = 'blur(' + effectLevelValue * 3 + 'px)';
            break;
          case 'heat':
            previewImage.style.filter = 'brightness(' + effectLevelValue * 3 + ')';
            break;
          default:
            imageEffectLevelSlider.classList.add('hidden');
            previewImage.style.removeProperty('filter');
            break;
        }
      }
    }
  };

  var onEffectPinChange = function (evt) {
    evt.preventDefault();

    var startCoords = evt.clientX;
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoords - moveEvt.clientX;
      startCoords = moveEvt.clientX;
      var currentX = imageEffectLevelPin.offsetLeft - shift;
      var validCoord = validateCoord(currentX);
      imageEffectLevelPin.style.left = validCoord + 'px';

      imageEffectDepth.style.width = validCoord / imageEffectLevel.offsetWidth * 100 + '%';
      changeEffects();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var validateCoord = function (x) {
    if (x <= 0) {
      x = 0;
    } else if (x >= imageEffectLevel.offsetWidth) {
      x = imageEffectLevel.offsetWidth;
    }
    return x;
  };

  var validateUploadDescription = function (evt) {
    if (evt.target.value.length > DESCRIPTION_MAX_LENGTH) {
      evt.target.setCustomValidity('Длина комментария не должна превышать 140 символов');
    } else {
      evt.target.setCustomValidity('');
    }
  };

  var onUploadFormSubmit = function () {
    uploadDescription.addEventListener('input', validateUploadDescription);
    uploadDescription.addEventListener('focus', function () {
      document.removeEventListener('keydown', window.handlers.onPopupEscPress);
    });
    uploadDescription.addEventListener('blur', function () {
      document.addEventListener('keydown', window.handlers.onPopupEscPress);
    });
  };

  window.form = {
    status: false,
    show: function () {
      previewPicture.classList.remove('hidden');
      resizePicture();
      imageEffects.addEventListener('change', changeEffects);
      window.handlers.onPopupClickClose(previewPictureClose);
      window.form.status = true;
      imageEffectLevelSlider.classList.add('hidden');
    },
    hide: function () {
      previewPicture.classList.add('hidden');
      previewPictureClose.removeEventListener('keydown', window.handlers.onPopupCloseEnterPress);
      pictureUpload.value = '';
      window.form.status = false;
    }
  };

  var previewPicture = document.querySelector('.img-upload__overlay');
  var previewPictureClose = previewPicture.querySelector('.img-upload__cancel');
  var previewImage = previewPicture.querySelector('.img-upload__preview img');
  var pictureUpload = document.querySelector('#upload-file');
  var sizeDec = previewPicture.querySelector('.scale__control--smaller');
  var sizeInc = previewPicture.querySelector('.scale__control--bigger');
  var sizeValue = previewPicture.querySelector('.scale__control--value');
  var imageEffects = previewPicture.querySelector('.effects');
  var imageEffectLevelSlider = previewPicture.querySelector('.effect-level');
  var imageEffectLevel = previewPicture.querySelector('.effect-level__line');
  var imageEffectLevelPin = previewPicture.querySelector('.effect-level__pin');
  var imageEffectDepth = previewPicture.querySelector('.effect-level__depth');
  var imageEffectLevelInput = previewPicture.querySelector('.effect-level__value');
  var uploadForm = document.querySelector('.img-upload__form');
  var uploadDescription = uploadForm.querySelector('.text__description');

  pictureUpload.addEventListener('change', window.form.show);
  imageEffectLevelPin.addEventListener('mousedown', onEffectPinChange);
  onUploadFormSubmit();
  uploadForm.action = UPLOAD_URL;

})();

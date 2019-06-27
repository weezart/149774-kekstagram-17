'use strict';
(function () {
  var PICTURE_RESIZE_STEP = 25;
  var PICTURE_MIN_SIZE = 25;
  var PICTURE_MAX_SIZE = 100;
  var DEC = 10;
  var DESCRIPTION_MAX_LENGTH = 140;
  var TAGS_MAX_NUMBER = 5;
  var TAG_MAX_LENGTH = 20;
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';

  var resizePicture = function () {
    imageSizeValue.value = '100%';
    uploadImage.style.removeProperty('transform');
    imageSizeDec.addEventListener('click', onPictureZoomIn);
    imageSizeInc.addEventListener('click', onPictureZoomOut);
  };

  var onPictureZoomIn = function () {
    var pictureSize = parseInt(imageSizeValue.value, DEC) - PICTURE_RESIZE_STEP;
    if (pictureSize >= PICTURE_MIN_SIZE) {
      imageSizeValue.value = pictureSize + '%';
      uploadImage.style.transform = 'scale(' + pictureSize / PICTURE_MAX_SIZE + ')';
    } else {
      pictureSize = PICTURE_MIN_SIZE;
    }
  };

  var onPictureZoomOut = function () {
    var pictureSize = parseInt(imageSizeValue.value, DEC) + PICTURE_RESIZE_STEP;
    if (pictureSize <= PICTURE_MAX_SIZE) {
      imageSizeValue.value = pictureSize + '%';
      uploadImage.style.transform = 'scale(' + pictureSize / PICTURE_MAX_SIZE + ')';
    } else {
      pictureSize = PICTURE_MAX_SIZE;
    }
  };

  var changeEffects = function () {
    var effects = imageEffects.querySelectorAll('[name="effect"]');
    for (var i = 0; i < effects.length; i++) {
      if (effects[i].checked) {
        imageEffectLevelSlider.classList.remove('hidden');
        var effectLevelValue = imageEffectLevelVal.offsetWidth / imageEffectLevel.offsetWidth;
        imageEffectLevelInput.value = parseInt(effectLevelValue * 100, DEC);
        switch (effects[i].value) {
          case 'chrome':
            uploadImage.style.filter = 'grayscale(' + effectLevelValue + ')';
            break;
          case 'sepia':
            uploadImage.style.filter = 'sepia(' + effectLevelValue + ')';
            break;
          case 'marvin':
            uploadImage.style.filter = 'invert(' + effectLevelValue * 100 + '%)';
            break;
          case 'phobos':
            uploadImage.style.filter = 'blur(' + effectLevelValue * 3 + 'px)';
            break;
          case 'heat':
            uploadImage.style.filter = 'brightness(' + effectLevelValue * 3 + ')';
            break;
          default:
            imageEffectLevelSlider.classList.add('hidden');
            uploadImage.style.removeProperty('filter');
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

      imageEffectLevelVal.style.width = validCoord / imageEffectLevel.offsetWidth * 100 + '%';
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

  var validateUploadHashtags = function (evt) {
    var tags = evt.target.value.split(' ');
    var usedTags = {};

    for (var i = 0; i < tags.length; i++) {
      if (tags[i] === '') {
        continue;
      }

      if (tags[i][0] !== '#') {
        evt.target.setCustomValidity('Хэш-тег должен начинаться с символа #');
        return;
      }

      if (tags[i].length > TAG_MAX_LENGTH) {
        evt.target.setCustomValidity('Максимальная длина одного хэш-тега равна 20 символов');
        return;
      }

      if (tags[i] in usedTags) {
        evt.target.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
        return;
      }

      usedTags[tags[i]] = true;
    }

    if (tags.length > TAGS_MAX_NUMBER) {
      evt.target.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
      return;
    }

    evt.target.setCustomValidity('');
  };

  var onUploadFormSubmit = function () {
    uploadHashtags.addEventListener('input', validateUploadHashtags);
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
      upload.classList.remove('hidden');
      resizePicture();
      imageEffects.addEventListener('change', changeEffects);
      window.handlers.onPopupClickClose(uploadClose);
      window.form.status = true;
      imageEffectLevelSlider.classList.add('hidden');
    },
    hide: function () {
      upload.classList.add('hidden');
      uploadClose.removeEventListener('keydown', window.handlers.onPopupCloseEnterPress);
      uploadInput.value = '';
      window.form.status = false;
    }
  };

  var form = document.querySelector('.upload-form');
  var upload = document.querySelector('.upload-overlay');
  var uploadClose = upload.querySelector('.upload-form-cancel');
  var uploadImage = upload.querySelector('.effect-image-preview');
  var uploadInput = document.querySelector('#upload-file');
  var uploadHashtags = form.querySelector('.upload-form-hashtags');
  var uploadDescription = form.querySelector('.upload-form-description');
  var imageSizeDec = form.querySelector('.upload-resize-controls-button-dec');
  var imageSizeInc = form.querySelector('.upload-resize-controls-button-inc');
  var imageSizeValue = form.querySelector('.upload-resize-controls-value');
  var imageEffects = form.querySelector('.upload-effect-controls');
  var imageEffectLevelSlider = form.querySelector('.upload-effect-level');
  var imageEffectLevel = form.querySelector('.upload-effect-level-line');
  var imageEffectLevelPin = form.querySelector('.upload-effect-level-pin');
  var imageEffectLevelVal = form.querySelector('.upload-effect-level-val');
  var imageEffectLevelInput = form.querySelector('.upload-effect-level-value');

  uploadHashtags.required = true;
  uploadInput.addEventListener('change', window.form.show);
  imageEffectLevelPin.addEventListener('mousedown', onEffectPinChange);
  onUploadFormSubmit();
  form.action = UPLOAD_URL;

})();

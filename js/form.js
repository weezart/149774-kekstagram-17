'use strict';
(function () {
  var PICTURE_RESIZE_STEP = 25;
  var PICTURE_MIN_SIZE = 25;
  var PICTURE_MAX_SIZE = 100;
  var PICTURE_EFFECT_DEFAULT_VALUE = 100;
  var DEC = 10;
  var DESCRIPTION_MAX_LENGTH = 140;
  var TAGS_MAX_NUMBER = 5;
  var TAG_MAX_LENGTH = 20;

  var choosePicture = function (previewElement, src) {
    previewElement.src = src;
    window.form.show();
  };

  var resizePicture = function () {
    sizeValue.value = '100%';
    sizeDec.addEventListener('click', onPictureZoomIn);
    sizeInc.addEventListener('click', onPictureZoomOut);
  };

  var resetEffects = function () {
    imageEffectLevelInput.value = PICTURE_EFFECT_DEFAULT_VALUE;
    imageEffectLevelPin.style.left = imageEffectLevelInput.value + '%';
    imageEffectDepth.style.width = imageEffectLevelInput.value + '%';
  };

  var onPictureZoomIn = function () {
    var pictureSize = parseInt(sizeValue.value, DEC) - PICTURE_RESIZE_STEP;
    if (pictureSize >= PICTURE_MIN_SIZE) {
      sizeValue.value = pictureSize + '%';
      previewImage.style.transform = 'scale(' + pictureSize / PICTURE_MAX_SIZE + ')';
    } else {
      pictureSize = PICTURE_MIN_SIZE;
    }
  };

  var onPictureZoomOut = function () {
    var pictureSize = parseInt(sizeValue.value, DEC) + PICTURE_RESIZE_STEP;
    if (pictureSize <= PICTURE_MAX_SIZE) {
      sizeValue.value = pictureSize + '%';
      previewImage.style.transform = 'scale(' + pictureSize / PICTURE_MAX_SIZE + ')';
    } else {
      pictureSize = PICTURE_MAX_SIZE;
    }
  };

  var changeEffects = function () {
    var effects = imageEffects.querySelectorAll('.effects__radio');

    for (var i = 0; i < effects.length; i++) {
      effects[i].addEventListener('change', function () {
        resetEffects();
      });
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

  var validate = function (hashtag, hashtags) {
    var checkRepeatingHashtag = function () {
      var numberOfRepeating = hashtags.slice().filter(function (hashtagItem) {
        return hashtagItem.toLowerCase() === hashtag.toLowerCase();
      }).length;
      return numberOfRepeating > 1;
    };

    if (hashtag.indexOf('#') !== 0) {
      pictureHashtags.setCustomValidity('хэш-тег должен начинаться с символа # (решётка)');
      return false;
    } else if (hashtag.length === 1) {
      pictureHashtags.setCustomValidity('хеш-тег не может состоять только из одной решётки');
      return false;
    } else if (hashtag.lastIndexOf('#') !== 0) {
      pictureHashtags.setCustomValidity('хэш-теги должны разделяться пробелами');
      return false;
    } else if (checkRepeatingHashtag()) {
      pictureHashtags.setCustomValidity('хэш-теги не должны повторяться');
      return false;
    } else if (hashtags.length > TAGS_MAX_NUMBER) {
      pictureHashtags.setCustomValidity('хэш-тегов не может быть более пяти' + TAGS_MAX_NUMBER);
      return false;
    } else if (hashtag.length > TAG_MAX_LENGTH) {
      pictureHashtags.setCustomValidity('максимальная длина одного хэш-тега ' + TAG_MAX_LENGTH + ' символов, включая решётку');
      return false;
    } else {
      pictureHashtags.setCustomValidity('');
      return true;
    }
  };

  var validatePictureHashtags = function (evt) {
    var hashtags = evt.target.value.split(' ');

    for (var i = 0; i < hashtags.length; i++) {
      if (!validate(hashtags[i], hashtags)) {
        break;
      }
    }
  };

  var validatePictureDescription = function (evt) {
    if (evt.target.value.length > DESCRIPTION_MAX_LENGTH) {
      evt.target.setCustomValidity('Длина комментария не должна превышать 140 символов');
    } else {
      evt.target.setCustomValidity('');
    }
  };

  var onUploadFormSubmit = function () {
    pictureHashtags.addEventListener('input', validatePictureHashtags);
    pictureHashtags.addEventListener('focus', function () {
      document.removeEventListener('keydown', window.handlers.onPopupEscPress);
    });
    pictureHashtags.addEventListener('blur', function () {
      document.addEventListener('keydown', window.handlers.onPopupEscPress);
    });
    pictureDescription.addEventListener('input', validatePictureDescription);
    pictureDescription.addEventListener('focus', function () {
      document.removeEventListener('keydown', window.handlers.onPopupEscPress);
    });
    pictureDescription.addEventListener('blur', function () {
      document.addEventListener('keydown', window.handlers.onPopupEscPress);
    });
    pictureHashtags.addEventListener('invalid', function (evt) {
      evt.target.style.border = '2px solid red';
    });

    pictureDescription.addEventListener('invalid', function (evt) {
      evt.target.style.border = '2px solid red';
    });
    sendForm();
  };

  var showSuccessMessage = function () {
    var messageFragment = document.createDocumentFragment();
    var message = successTemplate.cloneNode(true);

    messageFragment.appendChild(message);
    document.querySelector('main').appendChild(messageFragment);
    var closeButton = message.querySelector('.success__button');
    var closeMessage = function () {
      var messageBlock = document.querySelector('main .success');
      if (messageBlock) {
        messageBlock.remove();
      }
    };
    var closeMessageEsc = function (evt) {
      window.utils.isEscEvent(evt, closeMessage);
    };

    closeButton.addEventListener('click', closeMessage);
    document.addEventListener('keydown', closeMessageEsc);
  };

  var showErrorMessage = function () {
    var messageFragment = document.createDocumentFragment();
    var message = errorTemplate.cloneNode(true);
    window.form.hide();

    messageFragment.appendChild(message);
    document.querySelector('main').appendChild(messageFragment);
    var closeButton = message.querySelectorAll('.error__button');
    var closeMessage = function () {
      var messageBlock = document.querySelector('main .error');
      if (messageBlock) {
        messageBlock.remove();
      }
    };
    for (var i = 0; i < closeButton.length; i++) {
      closeButton[i].addEventListener('click', closeMessage);
    }
    var closeMessageEsc = function (evt) {
      window.utils.isEscEvent(evt, closeMessage);
    };
    document.addEventListener('keydown', closeMessageEsc);
  };

  var sendForm = function () {

    uploadForm.addEventListener('submit', function (evt) {
      evt.preventDefault();
      window.backend.save(new FormData(uploadForm), function () {
        window.form.hide();
        showSuccessMessage();
      }, showErrorMessage);
    });
  };

  window.form = {
    status: false,
    show: function () {
      previewPicture.classList.remove('hidden');
      resetEffects();
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
      this.reset();
    },
    reset: function () {
      uploadForm.reset();
      imageEffectDepth.style = '';
      previewImage.style = '';
      resetEffects();
      window.form.status = false;
    }
  };

  var previewPicture = document.querySelector('.img-upload__overlay');
  var previewPictureClose = previewPicture.querySelector('.img-upload__cancel');
  var previewImage = previewPicture.querySelector('.img-upload__preview img');
  var pictureUpload = document.querySelector('#upload-file');
  var pictureUploadDropZone = document.querySelector('.img-upload__control');
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
  var pictureHashtags = uploadForm.querySelector('.text__hashtags');
  var pictureDescription = uploadForm.querySelector('.text__description');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  pictureUpload.addEventListener('change', window.form.show);
  window.chooseImage(pictureUpload, pictureUploadDropZone, previewImage, choosePicture);
  imageEffectLevelPin.addEventListener('mousedown', onEffectPinChange);
  onUploadFormSubmit();

})();

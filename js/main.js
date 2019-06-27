'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 1;
var MAX_COMMENTS = 2;
var COUNT_PICTURES = 25;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var PICTURE_RESIZE_STEP = 25;
var PICTURE_MIN_SIZE = 25;
var PICTURE_MAX_SIZE = 100;
var DEC = 10;
var DESCRIPTION_MAX_LENGTH = 140;
var UPLOAD_URL = 'https://js.dump.academy/kekstagram';

var pictureTemplate = document.querySelector('template').content.querySelector('.picture');
var pictureFragment = document.createDocumentFragment();
var pictures = document.querySelector('.pictures');


var getRandomValues = function (arr) {
  var newArr = [];
  var randomCount = window.utils.getRandomIntegerRound(MIN_COMMENTS, MAX_COMMENTS);

  for (var i = 0; i < arr.length; i++) {
    newArr[i] = arr[i];
  }

  newArr.sort(compareRandom);

  return newArr.slice(0, randomCount);
};

var getDataPictures = function (count) {
  var dataPictures = [];

  for (var i = 0; i < count; i++) {
    dataPictures[i] = {
      'url': getImageUrl(i + 1),
      'likes': window.utils.getRandomIntegerRound(MIN_LIKES, MAX_LIKES),
      'comments': getRandomValues(COMMENTS)
    };
  }

  return dataPictures;
};

var renderPicture = function (dataPicture) {
  var picture = pictureTemplate.cloneNode(true);

  picture.setAttribute('tabindex', '0');
  picture.querySelector('.picture__img').src = dataPicture.url;
  picture.querySelector('.picture__likes').textContent = dataPicture.likes;
  picture.querySelector('.picture__comments').textContent = dataPicture.comments.length;

  return picture;
};

var insertPictures = function (dataPictures) {
  for (var i = 0; i < dataPictures.length; i++) {
    pictureFragment.appendChild(renderPicture(dataPictures[i]));
  }

  pictures.appendChild(pictureFragment);
};

var onPicturePreviewEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePicturePreview();
  }
};

var onPicturePreviewEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePicturePreview();
  }
};

var onPicturePreviewClickClose = function () {
  previewPictureClose.addEventListener('keydown', onPicturePreviewEnterPress);
  previewPictureClose.addEventListener('click', closePicturePreview);
  document.removeEventListener('keydown', onPicturePreviewEscPress);
};

var closePicturePreview = function () {
  previewPicture.classList.add('hidden');
  pictureUpload.value = '';
  previewPictureClose.removeEventListener('keydown', onPicturePreviewEnterPress);
};

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

var uploadPicture = function () {
  previewPicture.classList.remove('hidden');
  onPicturePreviewClickClose();
  resizePicture();
  imageEffects.addEventListener('change', changeEffects);
  document.addEventListener('keydown', onPicturePreviewEscPress);
};

var onUploadFormSubmit = function () {
  uploadDescription.addEventListener('input', validateUploadDescription);
  uploadDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', onPicturePreviewEscPress);
  });
  uploadDescription.addEventListener('blur', function () {
    document.addEventListener('keydown', onPicturePreviewEscPress);
  });
};

var validateUploadDescription = function (evt) {
  if (evt.target.value.length > DESCRIPTION_MAX_LENGTH) {
    evt.target.setCustomValidity('Длина комментария не должна превышать ' + DESCRIPTION_MAX_LENGTH + ' символов');
  } else {
    evt.target.setCustomValidity('');
  }
};

var dataPictures = getDataPictures(COUNT_PICTURES);
var pictureUpload = document.querySelector('#upload-file');
var previewPicture = document.querySelector('.img-upload__overlay');
var previewPictureClose = previewPicture.querySelector('.img-upload__cancel');
var previewImage = previewPicture.querySelector('.img-upload__preview img');
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

onUploadFormSubmit();
uploadForm.action = UPLOAD_URL;

insertPictures(dataPictures);
pictureUpload.addEventListener('change', uploadPicture);
imageEffectLevelPin.addEventListener('mousedown', onEffectPinChange);

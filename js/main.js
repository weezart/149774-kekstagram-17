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

var pictureTemplate = document.querySelector('template').content.querySelector('.picture');
var pictureFragment = document.createDocumentFragment();
var pictures = document.querySelector('.pictures');

var getImageUrl = function (filename) {
  return 'photos/' + filename + '.jpg';
};


var getRandomIntegerRound = function (min, max) {
  var rand = Math.random() * (max - min + 1) - 0.5;
  rand = min + Math.round(rand);
  return rand;
};

var getRandomIntegerFloor = function (min, max) {
  var rand = Math.random() * (max - min + 1);
  rand = min + Math.floor(rand);
  return rand;
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var getRandomValues = function (arr) {
  var newArr = [];
  var randomCount = getRandomIntegerRound(MIN_COMMENTS, MAX_COMMENTS);
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
      'likes': getRandomIntegerFloor(MIN_LIKES, MAX_LIKES),
      'comments': getRandomValues(COMMENTS)
    };
  }

  return dataPictures;
};

var renderPicture = function (dataPicture) {
  var picture = pictureTemplate.cloneNode(true);

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

var dataPictures = getDataPictures(COUNT_PICTURES);

insertPictures(dataPictures);

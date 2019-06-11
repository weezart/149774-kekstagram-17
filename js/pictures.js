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

var getImageUrl = function (filename) {
  return 'photos/' + filename + '.jpg';
};

var getRandomArbitary = function (min, max) {
  return Math.floor(Math.random() * max + 1);
};

var getRandomValues = function (arr) {
  var newArr = [];
  var randomCount = getRandomArbitary(MIN_COMMENTS, MAX_COMMENTS);
  var compareRandom = function () {
    return Math.random() - 0.5;
  };
  for (var i = 0; i < arr.length; i++) {
    newArr[i] = arr[i];
  }
  newArr.sort(compareRandom);
  return newArr.splice(0, randomCount);
};

var getDataPictures = function (i) {
  var dataPictures = [];
  for (var j = 0; j < i; j++) {
    dataPictures[j] = {
      'url': getImageUrl(j + 1),
      'likes': getRandomArbitary(MIN_LIKES, MAX_LIKES),
      'comments': getRandomValues(COMMENTS)
    };
  }

  return dataPictures;
};

getDataPictures(25);

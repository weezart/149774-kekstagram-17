'use strict';
(function () {
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

  window.data = {
    get: function (count) {
      var dataPictures = [];
      for (var i = 0; i < count; i++) {
        dataPictures[i] = {
          'url': getImageUrl(i + 1),
          'likes': window.utils.getRandomIntegerRound(MIN_LIKES, MAX_LIKES),
          'comments': window.utils.getRandomValues(COMMENTS, MIN_COMMENTS, MAX_COMMENTS)
        };
      }
      return dataPictures;
    }
  };
})();

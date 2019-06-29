
'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.utils = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    getRandomIntegerRound: function (min, max) {
      var rand = Math.random() * (max - min + 1) - 0.5;
      rand = min + Math.round(rand);
      return rand;
    },
    compareRandom: function () {
      return Math.random() - 0.5;
    },
    getRandomValues: function (arr, min, max) {
      var newArr = [];
      var randomCount = this.getRandomIntegerRound(min, max);
      for (var i = 0; i < arr.length; i++) {
        newArr[i] = arr[i];
      }
      newArr.sort(this.compareRandom);
      return newArr.slice(0, randomCount);
    }
  };
})();

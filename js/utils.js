
'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

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
    debounce: function (fn) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(fn, DEBOUNCE_INTERVAL);
    }
  };
})();

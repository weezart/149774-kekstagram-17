'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram';
  var SUCCESS_CODE = 200;
  var TIMEOUT = 5000;
  var ERROR_STYLES = {
    width: 50 + '%',
    height: 100 + 'px',
    bgColor: 'red',
    position: 'fixed',
    zIndex: 10,
    top: 50 + '%',
    left: 50 + '%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  };

  var upload = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onSuccess(xhr.response);
      } else {
        onError('Ошибка: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не выполнился за ' +
        Math.floor(xhr.timeout / 1000) + ' секунд');
    });

    xhr.timeout = TIMEOUT;
    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = upload(onLoad, onError);

      xhr.open('GET', URL + '/data');
      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var xhr = upload(onLoad, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    },

    onError: function (message) {
      var node = document.createElement('div');

      node.style.width = ERROR_STYLES.width;
      node.style.height = ERROR_STYLES.height;
      node.style.backgroundColor = ERROR_STYLES.bgColor;
      node.style.position = ERROR_STYLES.position;
      node.style.zIndex = ERROR_STYLES.zIndex;
      node.style.top = ERROR_STYLES.top;
      node.style.left = ERROR_STYLES.left;
      node.style.transform = ERROR_STYLES.transform;
      node.style.display = ERROR_STYLES.display;
      node.style.alignItems = ERROR_STYLES.alignItems;
      node.style.justifyContent = ERROR_STYLES.justifyContent;
      node.style.color = ERROR_STYLES.color;
      node.textContent = message;

      document.body.appendChild(node);
    }
  };
})();

'use strict';

(function () {
  var filters = document.querySelector('.img-filters');
  var filtersItemByPopular = filters.querySelector('#filter-popular');
  var filtersItemByDiscussed = filters.querySelector('#filter-discussed');
  var filtersItemByNew = filters.querySelector('#filter-new');
  var filtersButtons = filters.querySelectorAll('.img-filters__button');

  var sortByPopular = function () {
    window.filters.data.sort(function (first, second) {
      if (first.likes > second.likes) {
        return -1;
      } else if (first.likes < second.likes) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  var sortByDiscussed = function () {
    window.filters.data.sort(function (first, second) {
      if (first.comments.length > second.comments.length) {
        return -1;
      } else if (first.comments.length < second.comments.length) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  var sortByNew = function () {
    window.filters.data.sort(window.utils.compareRandom);
    window.filters.data.length = 10;
  };

  window.filters = {
    data: [],
    activate: function () {
      filters.classList.remove('img-filters--inactive');
    },
    use: function () {
      window.filters.data = window.data.pictures.slice();
      if (filtersItemByPopular.classList.contains('img-filters__button--active')) {
        sortByPopular();
      }
      if (filtersItemByDiscussed.classList.contains('img-filters__button--active')) {
        sortByDiscussed();
      }
      if (filtersItemByNew.classList.contains('img-filters__button--active')) {
        sortByNew();
      }
    },
    update: function () {
      window.filters.use();
      window.gallery.clean();
      window.gallery.fill(window.filters.data);
    },
    init: function () {
      for (var i = 0; i < filtersButtons.length; i++) {
        filtersButtons[i].addEventListener('click', function (evt) {
          filters.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
          evt.target.classList.add('img-filters__button--active');
          window.utils.debounce(window.filters.update);
        });
      }
    }
  };

})();

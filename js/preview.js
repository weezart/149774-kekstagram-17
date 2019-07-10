'use strict';

(function () {
  var COMMENTS_STEP = 5;
  var preview = document.querySelector('.big-picture');
  var previewClose = preview.querySelector('.big-picture__cancel');
  var AVATAR_ALT = 'Аватар комментатора фотографии';
  var AVATAR_SIZE = 35;
  var comment;

  var renderComment = function (commentData) {
    var commentElement = document.createElement('li');
    var commentAvatar = document.createElement('img');
    var commentText = document.createElement('p');
    commentElement.classList.add('social__comment');
    commentAvatar.classList.add('social__picture');
    commentAvatar.src = commentData.avatar;
    commentAvatar.width = AVATAR_SIZE;
    commentAvatar.height = AVATAR_SIZE;
    commentAvatar.alt = AVATAR_ALT;
    commentText.classList.add('social__text');
    commentText.textContent = commentData.message;
    commentElement.appendChild(commentAvatar);
    commentElement.appendChild(commentText);

    return commentElement;
  };

  window.preview = {
    status: false,
    show: function (dataPicture) {
      preview.classList.remove('hidden');
      var commentNumber = 0;
      var commentsList = preview.querySelector('.social__comments');
      preview.querySelector('.big-picture__img img').src = dataPicture.url;
      preview.querySelector('.social__caption').textContent = dataPicture.description;
      preview.querySelector('.likes-count').textContent = dataPicture.likes;
      preview.querySelector('.comments-count').textContent = dataPicture.comments.length;
      commentsList.textContent = '';
      if (dataPicture.comments.length <= COMMENTS_STEP) {
        preview.querySelector('.comments-step').textContent = dataPicture.comments.length;
        preview.querySelector('.social__comments-loader').classList.add('hidden');
      }
      for (commentNumber; commentNumber < COMMENTS_STEP; commentNumber++) {
        if (commentNumber < dataPicture.comments.length) {
          comment = renderComment(dataPicture.comments[commentNumber]);
          commentsList.appendChild(comment);
        }
      }
      window.handlers.onPopupClickClose(previewClose);
      this.status = true;
      preview.querySelector('.social__comment-count').classList.add('visually-hidden');
      preview.querySelector('.comments-loader').classList.add('visually-hidden');
    },
    hide: function () {
      preview.classList.add('hidden');
      previewClose.removeEventListener('keydown', window.handlers.onPopupCloseEnterPress);
      this.status = false;
    }
  };
})();

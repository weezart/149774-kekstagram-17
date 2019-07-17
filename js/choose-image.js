'use strict';

(function () {
  var FileType = ['gif', 'jpg', 'jpeg', 'png'];
  var DROP_COLOR = '#ff5635';

  var isCorrectFile = function (file) {
    if (file) {
      return FileType.some(function (item) {
        return file.name.toLowerCase().endsWith(item);
      });
    }

    return false;
  };

  window.chooseImage = function (fileChooserElement, dropZoneElement, previewElement, cb) {
    var readFiles = function (files) {
      [].forEach.call(files, function (item) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          cb(previewElement, reader.result);
        });

        reader.readAsDataURL(item);
      });
    };

    var onFileChooserChange = function () {
      if (isCorrectFile(fileChooserElement.files[0])) {
        readFiles(fileChooserElement.files);
      }
    };

    var onDropZoneDragOver = function (evt) {
      evt.preventDefault();

      dropZoneElement.style.color = DROP_COLOR;
      dropZoneElement.style.borderColor = DROP_COLOR;
      return false;
    };

    var onDropZoneDragEnter = function (evt) {
      evt.preventDefault();
    };

    var onDropZoneDragLeave = function (evt) {
      evt.preventDefault();

      dropZoneElement.style.color = '';
      dropZoneElement.style.borderColor = '';
    };

    var onDropZoneDrop = function (evt) {
      evt.preventDefault();

      dropZoneElement.style.color = '';
      dropZoneElement.style.borderColor = '';

      if (isCorrectFile(evt.dataTransfer.files[0])) {
        readFiles(evt.dataTransfer.files);
      }
    };

    fileChooserElement.addEventListener('change', onFileChooserChange);
    dropZoneElement.addEventListener('dragover', onDropZoneDragOver);
    dropZoneElement.addEventListener('dragenter', onDropZoneDragEnter);
    dropZoneElement.addEventListener('dragleave', onDropZoneDragLeave);
    dropZoneElement.addEventListener('drop', onDropZoneDrop);
  };
})();

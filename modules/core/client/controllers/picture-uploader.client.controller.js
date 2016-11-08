(function () {
  'use strict';

  angular
    .module('core')
    .controller('PictureUploaderController', PictureUploaderController);

  PictureUploaderController.$inject = ['$log', '$timeout', 'Upload', 'Notification'];

  function PictureUploaderController($log, $timeout, Upload, Notification) {
    var vm = this;
    vm.fileSelected = false;

    vm.upload = function (dataUrl, name) {
      Upload.upload({
        url: vm.uploadApiUrl,
        data: {
          newPicture: Upload.dataUrltoBlob(dataUrl, name)
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };
    $log.log(vm);
    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Upload picture successful!' });

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Upload picture failed!' });
    }
  }
}());

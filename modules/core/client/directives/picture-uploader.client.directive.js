(function () {
  'use strict';

  angular.module('core')
    .directive('pictureUploader', pictureUploader);

  function pictureUploader() {
    var directive = {
      restrict: 'E',
      scope: true,
      bindToController: {
        pictureUrl: '@',
        altText: '@',
        uploadApiUrl: '@'
      },
      controller: 'PictureUploaderController',
      controllerAs: 'vm',
      templateUrl: '/modules/core/client/views/picture-uploader.client.view.html'
    };

    return directive;
  }
}());

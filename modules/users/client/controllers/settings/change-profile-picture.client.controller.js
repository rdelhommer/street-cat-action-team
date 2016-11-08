(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['Authentication'];

  function ChangeProfilePictureController(Authentication) {
    var vm = this;
    vm.user = Authentication.user;
    vm.pictureUploadApiUrl = '/api/users/picture';
  }
}());

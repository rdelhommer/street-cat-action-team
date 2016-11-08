(function () {
  'use strict';

  angular
    .module('cats')
    .controller('CatsSubmitController', CatsSubmitController);

  CatsSubmitController.$inject = ['SubmitCatService'];

  function CatsSubmitController(SubmitCatService) {
    var vm = this;
    vm.name = '';
    vm.catSubmitted = false;
    vm.pictureUploadApiUrl = '';

    vm.submitCat = function() {
      var res = SubmitCatService.addCat(vm.name);

      res.success(function(data, status, headers, config) {
        vm.catSubmitted = true;
      });

      res.error(function(data, status, headers, config) {
        $log.error('failure message: ' + JSON.stringify({ data: data }));
        vm.catSubmitted = false;
      });
    };
  }
}());

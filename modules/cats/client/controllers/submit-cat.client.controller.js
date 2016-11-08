(function () {
  'use strict';

  angular
    .module('cats')
    .controller('CatsSubmitController', CatsSubmitController);

  CatsSubmitController.$inject = ['SubmitCatService'];

  function CatsSubmitController(SubmitCatService) {
    var vm = this;
    vm.name = '';

    vm.submitCat = function() {
      SubmitCatService.addCat(vm.name);
    };
  }
}());

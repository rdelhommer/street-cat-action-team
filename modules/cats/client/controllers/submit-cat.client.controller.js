(function () {
  'use strict';

  angular
    .module('cats')
    .controller('CatsSubmitController', CatsSubmitController);

  CatsSubmitController.$inject = ['$log', 'SubmitCatService'];

  function CatsSubmitController($log, SubmitCatService) {
    var vm = this;
    vm.name = '';
    vm.submitCat = function() {
      SubmitCatService.addCat(vm.name);
    };
  }
}());

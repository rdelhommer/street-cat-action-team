(function () {
  'use strict';

  angular
    .module('cats')
    .controller('CatsListController', CatsListController);

  CatsListController.$inject = ['CatsService'];

  function CatsListController(CatsService) {
    var vm = this;

    vm.cats = CatsService.query();
  }
}());

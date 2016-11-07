(function () {
  'use strict';

  angular
    .module('cats.admin')
    .controller('CatsAdminListController', CatsAdminListController);

  CatsAdminListController.$inject = ['CatsService'];

  function CatsAdminListController(CatsService) {
    var vm = this;

    vm.cats = CatsService.query();
  }
}());

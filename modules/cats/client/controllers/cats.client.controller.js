(function () {
  'use strict';

  angular
    .module('cats')
    .controller('CatsController', CatsController);

  CatsController.$inject = ['$scope', 'catResolve', 'Authentication', 'CatsService'];

  function CatsController($scope, cat, Authentication, CatsService) {
    var vm = this;

    vm.cat = cat;
    vm.authentication = Authentication;
  }
}());

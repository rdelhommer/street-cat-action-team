(function () {
  'use strict';

  angular
    .module('cats')
    .controller('CatsController', CatsController);

  CatsController.$inject = ['$scope', 'catResolve', 'Authentication'];

  function CatsController($scope, cat, Authentication) {
    var vm = this;

    vm.cat = cat;
    vm.authentication = Authentication;

  }
}());

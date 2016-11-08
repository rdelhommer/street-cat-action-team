(function () {
  'use strict';

  angular
    .module('cats')
    .controller('CatsListController', CatsListController);

  CatsListController.$inject = ['CatsService'];

  function CatsListController(CatsService) {
    var vm = this;

    vm.cats = CatsService.query();

    vm.getPicture = function(cat) {
      if(cat.pictures.length == 0) {
        return 'modules/cats/client/img/default.png';
      }

      return cat.pictures[0].imageURL;
    }
  }
}());

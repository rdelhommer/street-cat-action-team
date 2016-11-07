(function () {
  'use strict';

  // Configuring the Cats Admin module
  angular
    .module('cats.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Cats',
      state: 'admin.cats.list'
    });
  }
}());

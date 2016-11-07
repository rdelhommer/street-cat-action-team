(function () {
  'use strict';

  angular
    .module('cats')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Cats',
      state: 'cats',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'cats', {
      title: 'List Cats',
      state: 'cats.list',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'cats', {
      title: 'Submit a Cat',
      state: 'submit.cat',
      roles: ['admin', 'user']
    });
  }
}());

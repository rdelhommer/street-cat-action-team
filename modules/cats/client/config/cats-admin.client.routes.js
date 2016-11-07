(function () {
  'use strict';

  angular
    .module('cats.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.cats', {
        abstract: true,
        url: '/cats',
        template: '<ui-view/>'
      })
      .state('admin.cats.list', {
        url: '',
        templateUrl: '/modules/cats/client/views/admin/list-cats.client.view.html',
        controller: 'CatsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.cats.create', {
        url: '/create',
        templateUrl: '/modules/cats/client/views/admin/form-cat.client.view.html',
        controller: 'CatsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          catResolve: newCat
        }
      })
      .state('admin.cats.edit', {
        url: '/:catId/edit',
        templateUrl: '/modules/cats/client/views/admin/form-cat.client.view.html',
        controller: 'CatsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          catResolve: getCat
        }
      });
  }

  getCat.$inject = ['$stateParams', 'CatsService'];

  function getCat($stateParams, CatsService) {
    return CatsService.get({
      catId: $stateParams.catId
    }).$promise;
  }

  newCat.$inject = ['CatsService'];

  function newCat(CatsService) {
    return new CatsService();
  }
}());

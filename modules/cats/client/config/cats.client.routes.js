(function () {
  'use strict';

  angular
    .module('cats.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cats', {
        abstract: true,
        url: '/cats',
        template: '<ui-view/>'
      })
      .state('cats.list', {
        url: '',
        templateUrl: '/modules/cats/client/views/list-cats.client.view.html',
        controller: 'CatsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Cats List'
        }
      })
      .state('cats.view', {
        url: '/:catId',
        templateUrl: '/modules/cats/client/views/view-cat.client.view.html',
        controller: 'CatsController',
        controllerAs: 'vm',
        resolve: {
          catResolve: getCat
        },
        data: {
          pageTitle: 'Cat {{ catResolve.title }}'
        }
      })
      .state('submit', {
        abstract: true,
        url: '/submit',
        template: '<ui-view/>'
      })
      .state('submit.cat', {
        url: '',
        templateUrl: '/modules/cats/client/views/submit-cat.client.view.html',
        controller: 'CatsSubmitController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Submit a Cat'
        }
      });
  }

  getCat.$inject = ['$stateParams', 'CatsService'];

  function getCat($stateParams, CatsService) {
    return CatsService.get({
      catId: $stateParams.catId
    }).$promise;
  }
}());

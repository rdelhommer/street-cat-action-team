(function () {
  'use strict';

  angular
    .module('cats.services')
    .factory('CatsService', CatsService);

  CatsService.$inject = ['$resource', '$log'];

  function CatsService($resource, $log) {
    var Cat = $resource('/api/cats/:catId', {
      catId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Cat.prototype, {
      createOrUpdate: function () {
        var cat = this;
        return createOrUpdate(cat);
      },
      getPicture: function () {
        var cat = this;
        return getPicture(cat);
      }
    });

    return Cat;

    function createOrUpdate(cat) {
      if (cat._id) {
        return cat.$update(onSuccess, onError);
      } else {
        return cat.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(cat) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function getPicture(cat) {
      if (cat.pictures.length === 0) {
        return '/modules/cats/client/img/default.png';
      }

      return cat.pictures[0].imageURL;
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());

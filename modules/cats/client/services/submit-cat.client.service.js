(function () {
  'use strict';

  angular
    .module('cats.services')
    .factory('SubmitCatService', SubmitCatService);

  SubmitCatService.$inject = ['$log', '$http'];

  function SubmitCatService($log, $http) {
    return {
      addCat: function(name) {
        var catObj = {
          name: name
        };

        var res = $http.post('/api/cats', catObj);

        res.success(function(data, status, headers, config) {
          // TODO: Do something on success
        });

        res.error(function(data, status, headers, config) {
          $log.error("failure message: " + JSON.stringify({ data: data }));
        });
      }
    };
  }
}());

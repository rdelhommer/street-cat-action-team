(function () {
  'use strict';

  angular
    .module('cats.services')
    .factory('SubmitCatService', SubmitCatService);

  SubmitCatService.$inject = ['$log', '$http'];

  function SubmitCatService($log, $http) {
    return {
      addCat: function(name, pictureUrl) {
        var catObj = {
          name: name,
          pictureUrl: []
        };

        if (pictureUrl) {
          catObj.pictureUrl.push(pictureUrl);
        }

        return $http.post('/api/cats', catObj);
      }
    };
  }
}());

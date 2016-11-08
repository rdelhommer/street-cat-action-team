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

        var res = $http.post('/api/cats', catObj);

        res.success(function(data, status, headers, config) {
          // TODO: redirect to the new cat's page
        });

        res.error(function(data, status, headers, config) {
          // TODO: Use notification to show failure like the notification when
          // TODO cont: profile pic upload fails
          $log.error('failure message: ' + JSON.stringify({ data: data }));
        });
      }
    };
  }
}());

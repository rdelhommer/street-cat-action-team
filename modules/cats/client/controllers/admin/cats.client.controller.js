(function () {
  'use strict';

  angular
    .module('cats.admin')
    .controller('CatsAdminController', CatsAdminController);

  CatsAdminController.$inject = ['$scope', '$state', '$window', 'catResolve', 'Authentication', 'Notification'];

  function CatsAdminController($scope, $state, $window, cat, Authentication, Notification) {
    var vm = this;

    vm.cat = cat;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Cat
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.cat.$remove(function() {
          $state.go('admin.cats.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Cat deleted successfully!' });
        });
      }
    }

    // Save Cat
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.catForm');
        return false;
      }

      // Create a new cat, or update the current instance
      vm.cat.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.cats.list'); // should we send the User to the list or the updated Cat's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Cat saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Cat save error!' });
      }
    }
  }
}());

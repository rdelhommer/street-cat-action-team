(function () {
  'use strict';

  describe('Cats Admin Controller Tests', function () {
    // Initialize global variables
    var CatsAdminController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CatsService,
      mockCat,
      Notification;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CatsService_, _Notification_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CatsService = _CatsService_;
      Notification = _Notification_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock cat
      mockCat = new CatsService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Cat about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Cats controller.
      CatsAdminController = $controller('CatsAdminController as vm', {
        $scope: $scope,
        catResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
      spyOn(Notification, 'error');
      spyOn(Notification, 'success');
    }));

    describe('vm.save() as create', function () {
      var sampleCatPostData;

      beforeEach(function () {
        // Create a sample cat object
        sampleCatPostData = new CatsService({
          title: 'An Cat about MEAN',
          content: 'MEAN rocks!'
        });

        $scope.vm.cat = sampleCatPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CatsService) {
        // Set POST response
        $httpBackend.expectPOST('/api/cats', sampleCatPostData).respond(mockCat);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Cat saved successfully!' });
        // Test URL redirection after the cat was created
        expect($state.go).toHaveBeenCalledWith('admin.cats.list');
      }));

      it('should call Notification.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('/api/cats', sampleCatPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Cat save error!' });
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock cat in $scope
        $scope.vm.cat = mockCat;
      });

      it('should update a valid cat', inject(function (CatsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/cats\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test Notification success was called
        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Cat saved successfully!' });
        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.cats.list');
      }));

      it('should  call Notification.error if error', inject(function (CatsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/cats\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Cat save error!' });
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup cats
        $scope.vm.cat = mockCat;
      });

      it('should delete the cat and redirect to cats', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/cats\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Cat deleted successfully!' });
        expect($state.go).toHaveBeenCalledWith('admin.cats.list');
      });

      it('should should not delete the cat and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());

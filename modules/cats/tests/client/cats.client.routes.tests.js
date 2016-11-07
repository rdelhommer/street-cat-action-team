(function () {
  'use strict';

  describe('Cats Route Tests', function () {
    // Initialize global variables
    var $scope,
      CatsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CatsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CatsService = _CatsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('cats');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/cats');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('cats.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/cats/client/views/list-cats.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CatsController,
          mockCat;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('cats.view');
          $templateCache.put('/modules/cats/client/views/view-cat.client.view.html', '');

          // create mock cat
          mockCat = new CatsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Cat about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CatsController = $controller('CatsController as vm', {
            $scope: $scope,
            catResolve: mockCat
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:catId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.catResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            catId: 1
          })).toEqual('/cats/1');
        }));

        it('should attach an cat to the controller scope', function () {
          expect($scope.vm.cat._id).toBe(mockCat._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/cats/client/views/view-cat.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/cats/client/views/list-cats.client.view.html', '');

          $state.go('cats.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('cats/');
          $rootScope.$digest();

          expect($location.path()).toBe('/cats');
          expect($state.current.templateUrl).toBe('/modules/cats/client/views/list-cats.client.view.html');
        }));
      });
    });
  });
}());

(function() {
  var addLift = angular.module('undeadlifts.user.create-routine.add-lift', []);

  addLift.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.create-routine.add-lift',
          {
            url: '/add-lift',
            templateUrl: 'user/create-routine/add-lift/add-lift.html',
            controller: 'AddLiftController'
          }
        );
      }
    ]
  );

  addLift.controller('AddLiftController',
    [         '$window', '$state', '$scope', 'liftService',
      function($window,   $state,   $scope,   liftService) {
        var BARBELL = liftService.BARBELL;
        var DUMBELL = liftService.DUMBELL;
        var CABLE = liftService.CABLE;
        var OTHER = liftService.OTHER;

        $scope.types = [
          { name: 'All Lifts', type: -1 },
          { name: 'Barbell Lifts', type: BARBELL },
          { name: 'Dumbell Lifts', type: DUMBELL },
          { name: 'Cable Lifts', type: CABLE },
          { name: 'Other', type: OTHER }
        ];

        $scope.type = $scope.types[0];

        $scope.addLift = function(lift) {
          if ($scope.selected.indexOf(lift) === -1) {
            $scope.selected.push(lift);
          }
          if ($window.history && $window.history.back) {
            $window.history.back();
          } else {
            $state.transitionTo('user.create-routine.index', {}, { location: 'replace' });
          }
        };

        $scope.clearSelected = function() {
          $scope.selected = [];
        };

        $scope.isLiftSelectedFilter = function() {
          return function(lift) {
            return $scope.selected.indexOf(lift) === -1;
          };
        };

        $scope.isLiftTypeFilter = function(type) {
          return function(lift) {
            return type.type < 0 || type.type === lift.type;
          };
        };
      }
    ]
  );
})();
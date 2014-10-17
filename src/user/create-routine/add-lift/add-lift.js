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
    [         '$window', '$state', '$rootScope', '$scope', '$filter', 'liftService',
      function($window,   $state,   $rootScope,   $scope,   $filter,   liftService) {
        if ($rootScope.initialState) {
          $state.replace('user.create-routine.index');
          return;
        }
        var BARBELL = liftService.BARBELL;
        var DUMBBELL = liftService.DUMBBELL;
        var BODYWEIGHT = liftService.BODYWEIGHT;
        var CABLE = liftService.CABLE;

        $scope.types = [
          { name: 'Barbell', lifts: BARBELL },
          { name: 'Dumbbell', lifts: DUMBBELL },
          { name: 'Bodyweight', lifts: BODYWEIGHT} ,
          { name: 'Cable', lifts: CABLE }
        ];

        $scope.type = false;
        $scope.search = '';

        $scope.setType = function(type) {
          $scope.type = type;
        };

        $scope.filtered = [];
        angular.copy($scope.lifts, $scope.filtered);

        $scope.$watch('type', filterLifts);
        $scope.$watch('search', filterLifts);

        function filterLifts(newVal, oldVal) {
          if (newVal === oldVal) { return; }
          $scope.filtered = $scope.type.lifts;
//          $scope.filtered = $filter('filter')($scope.lifts, $scope.isLiftTypeFilter($scope.type));
          $scope.filtered = $filter('filter')($scope.filtered, $scope.search);
        }

        $scope.addLift = function(lift) {
          if (lift.name === 'Squat Rack Curls') {
            $scope.alert('Curls are not allowed in the squat rack.');
            return;
          }
          if ($scope.selected.indexOf(lift) === -1) {
            lift.type = $scope.type.name;
            $scope.selected.push(lift);
          }
          if ($window.history && $window.history.back) {
            $window.history.back();
          } else {
            $state.replace('user.create-routine.index');
          }
        };

        $scope.isLiftSelected = function(lift) {
          for (var i = 0; i < $scope.selected.length; i++) {
            var selected = $scope.selected[i];
            if (selected.name === lift.name && selected.type === $scope.type.name) {
              return true;
            }
          }
          return false;
        };

        $scope.clickSelect = function() {
          document.getElementById('type_select').click();
        };

        var shortNameLength = 15;
        $scope.getLiftClassName = function(lift) {
          //debugger;
          var lifts = $scope.filtered;
          var ix = lifts.indexOf(lift);
          var prev = lifts[ix - 1];
          var next = lifts[ix + 1];
          if (lift.name.length <= shortNameLength) {
            var consecutiveCount = getConsecutiveCount(ix);
            if (consecutiveCount % 2 === 1 && next && next.name.length <= shortNameLength) {
              return 'adapt50';
            } else if (consecutiveCount % 2 === 0 && prev && prev.name.length <= shortNameLength) {
              return 'adapt50';
            }
          }
          return {};

          function getConsecutiveCount(ix) {
            var count = 0;
            for (var i = ix; i > -1; i--) {
              if (lifts[i].name.length <= shortNameLength) {
                count++;
              } else {
                break;
              }
            }
            return count;
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
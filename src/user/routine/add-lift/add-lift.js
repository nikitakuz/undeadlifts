(function() {
  var addLift = angular.module('undeadlifts.user.routine.create.add-lift', []);

  addLift.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.routine.create.add-lift',
          {
            title: 'Add Lift',
            url: '/add-lift',
            templateUrl: 'user/routine/add-lift/add-lift.html',
            controller: 'AddLiftController'
          }
        );

        $stateProvider.state('user.routine.edit.add-lift',
          {
            title: 'Add Lift',
            url: '/add-lift',
            templateUrl: 'user/routine/add-lift/add-lift.html',
            controller: 'AddLiftController'
          }
        );
      }
    ]
  );

  addLift.controller('AddLiftController',
    [         '$window', '$state', '$rootScope', '$scope', '$filter',
      function($window,   $state,   $rootScope,   $scope,   $filter) {
        if ($rootScope.initialState) {
          $state.replace('user.routine.create');
          return;
        }

        $scope.filtered = [];
        $scope.setType(false);

        $scope.$watch('type', filterLifts);
        $scope.$watch('search', filterLifts);

        function filterLifts(newVal, oldVal) {
          if (newVal === oldVal) { return; }
          $scope.filtered = $filter('filter')($scope.type.LIFTS, $scope.search);
        }

        $scope.isLiftSelected = function(lift) {
          for (var i = 0; i < $scope.selected.length; i++) {
            var selected = $scope.selected[i];
            if (selected.name === lift.name && selected.type === $scope.type.NAME) {
              return true;
            }
          }
          return false;
        };

        var shortNameLength = 14;
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
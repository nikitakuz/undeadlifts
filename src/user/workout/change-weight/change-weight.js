(function() {
  var changeWeight = angular.module('undeadlifts.user.workout.change-weight', []);

  changeWeight.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.workout.change-weight',
          {
            url: '/change-weight/:index',
            templateUrl: 'user/workout/change-weight/change-weight.html',
            controller: 'ChangeWeightController'
          }
        );
      }
    ]
  );

  changeWeight.controller('ChangeWeightController',
    [         '$scope', '$state', '$stateParams', 'workout',
      function($scope,   $state,   $stateParams,   workout) {
        $scope.lift = $scope.lifts[$stateParams.index];
        $scope.weight = $scope.lift.weight;
        $scope.plates = {};

        calculatePlates();

        $scope.decreaseWeight = function() {
          $scope.weight = $scope.weight - 5;
          calculatePlates();
        };

        $scope.increaseWeight = function() {
          $scope.weight = $scope.weight + 5;
          calculatePlates();
        };

        $scope.saveWeight = function() {
          $scope.lift.weight = $scope.weight;
          $state.back();
        };

        $scope.cancelChanges = function() {
          $state.back();
        };

        function calculatePlates() {
          var each_side = ($scope.weight - 45) / 2;
          var plates = {'45': 0, '35': 0, '25': 0, '10': 0, '5': 0, '2.5': 0};
          while (each_side > 0) {
            if (each_side >= 45) {
              plates['45']++;
              each_side -= 45;
            } else if (each_side >= 35) {
              plates['35']++;
              each_side -= 35;
            } else if (each_side >= 25) {
              plates['25']++;
              each_side -= 25;
            } else if (each_side >= 10) {
              plates['10']++;
              each_side -= 10;
            } else if (each_side >= 5) {
              plates['5']++;
              each_side -= 5;
            } else if (each_side >= 2.5) {
              plates['2.5']++;
              each_side -= 2.5;
            } else {
              break;
            }
          }
          $scope.plates = plates;
        }
      }
    ]
  );
})();
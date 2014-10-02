undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.workout.change-weight',
        {
          url: '/change-weight/:lift',
          templateUrl: 'user/workout/change-weight/change-weight.html',
          controller: 'ChangeWeightController'
        }
      );
    }
  ]
);
undeadlifts.controller('ChangeWeightController',
  [         '$scope', '$state', '$stateParams', 'workout', 'lifts',
    function($scope,   $state,   $stateParams,   workout,   lifts) {
      $scope.lift = $stateParams.lift;
      $scope.lifts = lifts;
      $scope.user.working_weight = $scope.user.working_weight || {};
      $scope.weight = Number($scope.user.working_weight[$scope.lift]);
      $scope.weight = $scope.weight || lifts.getStartingWeight($scope.lift);
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
        if ($state.includes('user.workout')) {
          $scope.user.working_weight[$scope.lift] = $scope.weight;
          $scope.user.$save();
        }
        var lifts = $scope.workout.routine.lifts;
        for (var i = 0; i < lifts.length; i++) {
          if (lifts[i].name === $scope.lift) {
            lifts[i].weight = $scope.weight;
          }
        }
        window.history.back();
      };

      $scope.cancelChanges = function() {
        window.history.back();
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

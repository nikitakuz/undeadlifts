cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.workout.change-weight',
        {
          url: '/change-weight/:lift',
          templateUrl: 'partials/workout/change-weight.html',
          controller: 'ChangeWeightController'
        }
      );
    }
  ]
);
cleanlifts.controller('ChangeWeightController',
  [         '$scope', '$state', '$stateParams',
    function($scope,   $state,   $stateParams) {
      $scope.lift = $stateParams.lift;
      $scope.weight = Number($scope.user.working_weight[$scope.lift]);
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
        $scope.user.working_weight[$scope.lift] = $scope.weight;
        $scope.user.$save();
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

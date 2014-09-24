undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.create-routine',
        {
          url: '/create-routine',
          templateUrl: 'user/create-routine/create-routine.html',
          controller: 'CreateRoutineController'
        }
      );
    }
  ]
);

undeadlifts.controller('CreateRoutineController',
  [         '$scope',
    function($scope) {
      var BARBELL = 0;
      var DUMBELL = 1;
      var CABLE = 2;
      var BODYWEIGHT = 3;

      $scope.selected = [];
      $scope.type = -2;

      $scope.lifts = [
        { name: 'Squat', type: BARBELL, sets: 5, reps: 5 },
        { name: 'Arnold Press', type: DUMBELL, sets: 5, reps: 5 },
        { name: 'Barbell Curls', type: BARBELL, sets: 5, reps: 5 },
        { name: 'Barbell Row', type: BARBELL, sets: 5, reps: 5 },
        { name: 'Barbell Shrugs', type: BARBELL, sets: 5, reps: 5 },
        { name: 'Bench Press', type: BARBELL, sets: 5, reps: 5 },
        { name: 'Cable Crunches', type: CABLE, sets: 5, reps: 5 },
        { name: 'Deadlift', type: BARBELL, sets: 5, reps: 5 },
        { name: 'Dips', type: BODYWEIGHT, sets: 5, reps: 5 },
        { name: 'Dumbell Curls', type: DUMBELL, sets: 5, reps: 5 },
        { name: 'Hyperextensions', type: BODYWEIGHT, sets: 5, reps: 5 },
        { name: 'Overhead Press', type: BARBELL, sets: 5, reps: 5 },
        { name: 'Power Clean', type: BARBELL, sets: 5, reps: 5 },
        { name: 'Pushups', type: BODYWEIGHT, sets: 5, reps: 5 },
        { name: 'Pullups', type: BODYWEIGHT, sets: 5, reps: 5 },
        { name: 'Tricep Extensions', type: CABLE, sets: 5, reps: 5 }
      ];

      $scope.selectLift = function(lift) {
        if ($scope.selected.indexOf(lift) > -1) { return; }
        $scope.selected.push(lift);
      };

      $scope.deselectLift = function(lift) {
        var index = $scope.selected.indexOf(lift);
        $scope.selected.splice(index, 1);
      };

      $scope.isLiftSelectedFilter = function() {
        return function(lift) {
          return $scope.selected.indexOf(lift) === -1
        }
      };

      $scope.isLiftTypeFilter = function() {
        return function(lift) {
          var type = parseInt($scope.type);
          return type < 0 || type === lift.type;
        }
      };
    }
  ]
);
undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.create-routine.sets-and-reps',
        {
          url: '/sets-and-reps',
          templateUrl: 'user/create-routine/sets-and-reps/sets-and-reps.html',
          controller: 'SetsAndRepsController'
        }
      );
    }
  ]
);
undeadlifts.controller('SetsAndRepsController',
  [         '$state', '$scope',
    function($state,   $scope) {
      if (!$scope.selected || $scope.selected.length < 1) {
        $state.transitionTo('user.create-routine', {}, { location: 'replace' });
      }

      $scope.routine = {
        name: '',
        lifts: JSON.parse(JSON.stringify($scope.selected))
      };

      $scope.createRoutine = function() {
        var routines = $scope.user.routines;
        for (var i = 0; i < routines.length; i++) {
          if (routines[i].name === $scope.routine.name) {
            alert('A routine with the this name already exists.');
            return;
          }
        }
        var lifts = $scope.routine.lifts;
        for (var j = 0; j < lifts.length; j++) {
          var lift = lifts[j];
          var sets = [];
          for (var k = 0; k < lift.sets; k++) {
            sets.push({ target: lift.reps });
          }
          lifts[j] = {
            name: lift.name,
            sets: sets
          }
        }
        routines.push($scope.routine);
        $scope.user.$save();
      };
    }
  ]
);
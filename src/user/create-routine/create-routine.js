undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.create-routine',
        {
          abstract: true,
          url: '/create-routine',
          template: '<div><ui-view class="create-routine"/></div>',
          controller: 'AbstractCreateRoutineController'
        }
      );

      $stateProvider.state('user.create-routine.index',
        {
          url: '',
          templateUrl: 'user/create-routine/create-routine.html',
          controller: 'CreateRoutineController'
        }
      );
    }
  ]
);
undeadlifts.controller('AbstractCreateRoutineController',
  [         '$state', '$scope', 'lifts',
    function($state,   $scope, lifts) {
      $scope.MIN_SETS = 1;
      $scope.MAX_SETS = 5;
      $scope.MIN_REPS = 1;
      $scope.MAX_REPS = 25;

/*
      $scope.selected = [
        {"name":"Cable Crunches","type":2,"sets":5,"reps":5},
        {"name":"Barbell Press","type":0,"sets":5,"reps":5},
        {"name":"Power Clean","type":0,"sets":5,"reps":5}
      ];
*/
      $scope.selected = $scope.selected || [];

      $scope.lifts = lifts.ORDERED;

      $scope.routine = {
        name: ''
      };

      $scope.decreaseSets = function(lift) {
        lift.sets = Math.max(lift.sets - 1, $scope.MIN_SETS);
      };

      $scope.increaseSets = function(lift) {
        lift.sets = Math.min(lift.sets + 1, $scope.MAX_SETS);
      };

      $scope.decreaseReps = function(lift) {
        lift.reps = Math.max(lift.reps - 1, $scope.MIN_REPS);
      };

      $scope.increaseReps = function(lift) {
        lift.reps = Math.min(lift.reps + 1, $scope.MAX_REPS);
      };

      $scope.removeLift = function(lift) {
        var index = $scope.selected.indexOf(lift);
        $scope.selected.splice(index, 1);
      };

      $scope.createRoutine = function() {
        $scope.user.routines = $scope.user.routines || [];
        var routines = $scope.user.routines;
        for (var i = 0; i < routines.length; i++) {
          if (routines[i].name === $scope.routine.name) {
            alert('A routine with the this name already exists.');
            return;
          }
        }

        var routine = $scope.routine;
        routine.lifts = JSON.parse(JSON.stringify($scope.selected));

        for (var j = 0; j < routine.lifts.length; j++) {
          var lift = routine.lifts[j];
          var sets = [];
          for (var k = 0; k < lift.sets; k++) {
            sets.push({ target: lift.reps });
          }
          routine.lifts[j] = {
            name: lift.name,
            sets: sets
          }
        }
        routines.push(routine);
        $scope.user.$save();
        $state.transitionTo('user.select-routine', {}, {location: 'replace'});
      };
    }
  ]
);
undeadlifts.controller('CreateRoutineController',
  [
    function() {}
  ]
);

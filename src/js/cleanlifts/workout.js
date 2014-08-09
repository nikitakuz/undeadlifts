cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.select-routine',
        {
          url: '/select-routine',
          templateUrl: 'partials/select-routine.html',
          controller: 'SelectRoutineController',
          resolve: {
            'routines': ['DataService', function(DataService) {
              return DataService.getRoutinesPromise();
            }]
          }
        }
      );

      $stateProvider.state('user.workout',
        {
          url: '/workout',
          templateUrl: 'partials/workout.html',
          controller: 'WorkoutController',
          resolve: {
            'history': ['DataService', function(DataService) {
              return DataService.getHistoryPromise();
            }]
          }
        }
      );
    }
  ]
);

cleanlifts.controller('SelectRoutineController',
  [         '$scope', '$state', 'log', 'user', 'routines',
    function($scope,   $state,   log,   user,   routines) {
      log('Waiting for user to select a routine...');
      $scope.routines = routines;

      $scope.selectRoutine = function(routine) {
        log('User selected a routine.');
        log('Routine chosen: ' + routine.name);
        user.current_routine = { name: routine.name, lifts: routine.lifts };
        user.$save();
        $state.transitionTo('user.workout', {}, {});
      };
    }
  ]
);
cleanlifts.controller('WorkoutController',
  [         '$scope', '$state', 'log', 'user', 'history',
    function($scope,   $state,   log,   user,   history) {
      if (!user.current_routine) {
        $state.transitionTo('user.select-routine', {}, { location: 'replace' });
        return;
      }
      $scope.routine = user.current_routine;
      $scope.weight_unit = user.weight_unit;

      $scope.lifts = $scope.routine.lifts.map(function(val, i, array) {
        var split = val.sets.split('x');
        var num_sets = split[0];
        var num_reps = split[1];
        var pluralized = { 1: 'one-set', 2: 'two-sets', 3: 'three-sets', 4: 'four-sets', 5: 'five-sets' }[split[0]];
        var completed = createArrayFilledWithNumber(num_sets, -1);
        var weight = user.working_weight[val.name] || 45;
        return { name: val.name, weight: weight, classname: pluralized, sets: num_sets, reps: num_reps, completed: completed };
      });

      $scope.updateSet = function(lift, si) {
        if (lift.completed[si] > -1) {
          lift.completed[si]--;
        } else {
          lift.completed[si] = lift.reps;
        }
      };

      $scope.changeWorkingWeight = function(lift_name) {
        var current = user.working_weight[lift_name];
        var working_weight = prompt('Enter new working weight for ' + lift_name.toLowerCase(), current);
        if (working_weight) {
          user.working_weight[lift_name] = working_weight;
          user.$save();
        }
      };

      $scope.finishWorkout = function() {
        var lifts = $scope.lifts.map(function(e, i) {
          return { name: e.name, sets: e.sets, reps: e.reps, completed: e.completed, weight: e.weight };
        });
        var workout = {
          routine_name: $scope.routine.name,
          lifts: lifts
        };
        history.$add(workout).then(function(ref) {
          user.current_routine = null;
          user.$save().then(function(ref) {
            $state.transitionTo('user.history', {}, { location: 'replace' });
          });
        });
      };

      function createArrayFilledWithNumber(length, number) {
        var a = Array.apply(null, Array(parseInt(length)))
        return a.map(function() { return number; })
      }
    }
  ]
);
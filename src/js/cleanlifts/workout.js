cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.select-routine',
        {
          url: '/select-routine',
          templateUrl: 'partials/select-routine.html',
          controller: 'SelectRoutineController',
          resolve: {
            'routines': ['UserService', function(UserService) {
              return UserService.getRoutines();
            }]
          }
        }
      );

      $stateProvider.state('user.workout',
        {
          url: '/workout',
          templateUrl: 'partials/workout.html',
          controller: 'WorkoutController'
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
        user.current_workout = { routine: { name: routine.name, exercises: routine.exercises }};
        user.$save();
        $state.transitionTo('user.workout', {}, {});
      };
    }
  ]
);
cleanlifts.controller('WorkoutController',
  [         '$scope', '$state', 'log', 'user',
    function($scope,   $state,   log,   user) {
      $scope.routine = user.current_workout.routine;
    }
  ]
);
undeadlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.select-routine',
        {
          url: '/select-routine',
          templateUrl: 'user/select-routine/select-routine.html',
          controller: 'SelectRoutineController'
        }
      );
    }
  ]
);
undeadlifts.controller('SelectRoutineController',
  [         '$scope', '$state', '$filter', 'firebase', 'log', 'user',
    function($scope,   $state,   $filter,   firebase,   log,   user) {
      log('Waiting for user to select a routine...');
      $scope.routines = JSON.parse(JSON.stringify(user.routines)); // BAD HACK. Sorry.

      $scope.selectRoutine = function(routine) {
        log('User selected a routine.');
        log('Routine chosen: ' + routine.name);
        // Remove firebase properties($id, $priority) and protect against unintentional modification.
        var routine_copy = { name: routine.name, lifts: JSON.parse(JSON.stringify(routine.lifts)) };
        var now = new Date();
        var workout = {
          routine: routine_copy,
          timestamp: now.getTime(),
          yyyymmdd: $filter('date')(now, 'yyyyMMdd')
        };
        firebase.push('workouts', workout, function(err, refId) {
          if (!err) {
            user.current_workout = refId;
            user.$save();
            $state.transitionTo('user.workout', {}, {});
          } else {
            console.log('Failed to create a workout.');
          }
        });
      };
    }
  ]
);

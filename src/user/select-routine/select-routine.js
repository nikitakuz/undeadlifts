(function() {
  var selectRoutine = angular.module('undeadlifts.user.select-routine', []);

  selectRoutine.config(
    [         '$stateProvider',
      function($stateProvider) {
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

  selectRoutine.controller('SelectRoutineController',
    [         '$scope', '$state', '$filter', 'firebase', 'log', 'user',
      function($scope,   $state,   $filter,   firebase,   log,   user) {
        log('Waiting for user to select a routine...');
        if (user.routines) {
          $scope.routines = JSON.parse(JSON.stringify(user.routines)); // BAD HACK. Sorry.
        } else {
          $scope.routines = [];
        }

        $scope.selectRoutine = function(routine) {
          if (user.current_workout) {
            if (confirm('Selecting a new routine will override your current workout. Would you like to continue?')) {
              firebase.sync(['workouts', user.current_workout]).$remove();
              delete user.current_workout;
            } else {
              return;
            }
          }
          log('User selected a routine.');
          log('Routine chosen: ' + routine.name);
          // Remove firebase properties($id, $priority) and protect against unintentional modification.
          var routine_copy = { name: routine.name, lifts: angular.copy(routine.lifts) };
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
})();


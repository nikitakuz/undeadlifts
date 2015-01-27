(function() {
  var selectRoutine = angular.module('undeadlifts.user.routine.select', []);

  selectRoutine.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.routine.select',
          {
            url: '/select-routine',
            templateUrl: 'user/routine/select/select.html',
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

        $scope.showConfirm = function(routine) {
          $scope.confirm({
            message:
              '<div class="h3-font-size">Current workout exists.</div>' +
              '<div>Selecting a new routine will override your current workout.</div>' +
              '<div>Would you like to continue?</div>',
            cancelText: 'Cancel',
            confirmText: 'Override',
            confirmCallback: function() {
              firebase.sync(['workouts', user.current_workout]).$remove();
              delete user.current_workout;
              $scope.selectRoutine(routine);
            }
          });
        };

        $scope.selectRoutine = function(routine) {
          log('User selected a routine.');
          log('Routine chosen: ' + routine.name);
          // Remove firebase properties($id, $priority) and protect against unintentional modification.
          var routine_copy = { name: routine.name, lifts: angular.copy(routine.lifts) };
          var now = new Date();
          var workout = {
            routine: {
              name: routine.name,
              lifts: routineLiftsToWorkoutLifts(routine.lifts)
            },
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

        function routineLiftsToWorkoutLifts(routineLifts) {
          var lifts = [];
          for (var i = 0; i < routineLifts.length; i++) {
            var lift = routineLifts[i];
            var sets = [];
            for (var j = 0; j < lift.sets; j++) {
              sets.push({ target: lift.reps });
            }
            lifts.push({
              name: lift.name,
              type: lift.type || 'Bodyweight',
              weight: lift.weight || 0,
              sets: sets
            });
          }
          return lifts;
        }
      }
    ]
  );
})();


(function() {
  var workout = angular.module('undeadlifts.user.workout',
    [
      'undeadlifts.user.workout.lift',
      'undeadlifts.user.workout.rest-timer',
      'undeadlifts.user.workout.change-date',
      'undeadlifts.user.workout.change-weight'
    ]
  );

  workout.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.workout',
          {
            title: 'Workout',
            url: '/workout',
            templateUrl: 'user/workout/workout.html',
            controller: 'WorkoutController',
            resolve: {
              'workout': ['firebase', 'user', function(firebase, user) {
                if (!user.current_workout) { return false; }
                var path = ['workouts', user.current_workout];
                return firebase.sync(path).$asObject().$loaded();
              }],
              'lifts': ['firebase', 'user', function(firebase, user) {
                if (!user.current_workout) { return false; }
                var path = ['workouts', user.current_workout, 'routine', 'lifts'];
                return firebase.sync(path).$asArray().$loaded();
              }]
            }
          }
        );
      }
    ]
  );

  workout.controller('WorkoutController',
    [         '$rootScope', '$scope', '$state', '$filter', 'firebase', 'util', 'user', 'workout', 'lifts',
      function($rootScope,   $scope,   $state,   $filter,   firebase,   util,   user,   workout,   lifts) {
        $scope.restTimerTimeout = null;
        $scope.restTimerInterval = null;
        $scope.showRestTimer = false;
        $scope.restTime = 0;

        if (!workout || !workout.routine) {
          $state.transitionTo('user.routine.select', {}, { location: 'replace' });
          return;
        }

        workout.$bindTo($scope, 'workout').then(function() {
          var valid = validateWorkout($scope.workout);
          if (!valid) {
            $state.replace('user.routine.select');
            return;
          }
          $scope.date = util.parseYyyyMmDd($scope.workout.yyyymmdd);
          $scope.routine = $scope.workout.routine;
        });

        $scope.$watch('workout.yyyymmdd', function(newVal, oldVal) {
          if (typeof newVal !== 'string') { return; }
          $scope.date = util.parseYyyyMmDd($scope.workout.yyyymmdd);
        });

        $scope.$watch('user.current_workout', function(newVal, oldVal) {
          if (!newVal) {
            $state.replace('user.routine.select');
          }
        });

        $scope.lifts = lifts;
        for (var i = 0; i < $scope.lifts.length; i++) {
          var lift = $scope.lifts[i];
          if (!lift.weight) {
            user.working_weight = user.working_weight || {};
            lift.weight = user.working_weight[lift.name] || 0;
            $scope.lifts.$save(i);
          }

          $scope.$watch('lifts[' + i + ']', onLiftChange, true);
        }

        function onLiftChange(newVal, oldVal) {
          $scope.lifts.$save(newVal);
          var startTimer = false;
          var target, completed;
          if (!allSetsCompleted(newVal.sets)) {
            for (var i = 0; i < newVal.sets.length; i++) {
              var newCompleted = newVal.sets[i].completed;
              var oldCompleted = oldVal.sets[i].completed;
              // Check if this is the set that changed and if the set has been marked completed
              if (newCompleted !== oldCompleted && newCompleted !== undefined) {
                startTimer = true;
                target = newVal.sets[i].target;
                completed = newCompleted;
              }
            }
          }

          if ($rootScope.restTimer && startTimer) {
            $rootScope.restTimer.start(target, completed);
          } else if ($rootScope.restTimer) {
            $rootScope.restTimer.clear();
          }

          function allSetsCompleted(sets) {
            var completed = true;
            for (var i = 0; i < sets.length; i++) {
              if (sets[i].completed === undefined) {
                completed = false;
              }
            }
            return completed;
          }
        }

        function validateWorkout(workout) {
          var valid = workout.yyyymmdd && workout.routine;
          if (valid) {
            return true;
          } else {
            delete user.current_workout;
            user.$save();
            return false;
          }
        }

        $scope.finishWorkout = function() {
          var yyyymmdd = $scope.workout.yyyymmdd;
          user.history = user.history || {};
          var workout_exists = typeof user.history[yyyymmdd] === 'string';
          if (workout_exists && user.history[yyyymmdd] !== $scope.workout.$id) {
            if (confirm('A workout already exists for this date. Do you want to overwrite it with this one?')) {
              saveWorkout();
            }
          } else {
            saveWorkout();
          }

          function saveWorkout() {
            user.history[$scope.workout.yyyymmdd] = user.current_workout;
            delete $scope.workout.yyyymmdd;
            delete user.current_workout;
            user.$save();
            $state.replace('user.index');
          }
        };

        $scope.selectNewDate = function(date) {
          $scope.workout.yyyymmdd = $filter('date')(date, 'yyyyMMdd');
        };

        $scope.nav.menuItems = [ {
          text: 'Change Routine',
          callback: function() {
            // TODO: Change routine should be its own psuedo-state.
            $state.transitionTo('user.routine.select', {}, {});
          }
        }, {
          text: 'Delete Workout',
          callback: function() {
            $scope.confirm({
              message:
                '<div>Are you sure you want to delete this workout?</div>',
              cancelText: 'Cancel',
              confirmText: 'Delete',
              confirmCallback: function() {
                delete user.current_workout;
                firebase.sync(['workouts', $scope.workout.$id]).$remove();
                user.$save().then(function(ref) {
                  $state.replace('user.index');
                });
              }
            });
          }
        } ];
      }
    ]
  );
})();
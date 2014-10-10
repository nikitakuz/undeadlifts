(function() {
  var workout = angular.module('undeadlifts.user.workout', []);

  workout.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.workout',
          {
            url: '/workout',
            templateUrl: 'user/workout/workout.html',
            controller: 'WorkoutController',
            resolve: {
              'workout': ['firebase', 'user', function(firebase, user) {
                if (!user.current_workout) { return false; }
                var path = ['workouts', user.current_workout];
                return firebase.sync(path).$asObject().$loaded();
              }]
            }
          }
        );
      }
    ]
  );

  workout.controller('WorkoutController',
    [         '$rootScope', '$scope', '$state', '$timeout', '$filter', 'replaceState', 'firebase', 'util', 'log', 'user', 'workout', 'lifts',
      function($rootScope,   $scope,   $state,   $timeout,   $filter,   replaceState,   firebase,   util,   log,   user,   workout,   lifts) {
        $scope.restTimerTimeout = null;
        $scope.restTimerInterval = null;
        $scope.showRestTimer = false;
        $scope.restTime = 0;

        if (!workout || !workout.routine) {
          $state.transitionTo('user.select-routine', {}, { location: 'replace' });
          return;
        }

        workout.$bindTo($scope, 'workout').then(function() {
          var valid = validateWorkout($scope.workout);
          if (!valid) {
            $state.replace('user.select-routine');
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
            $state.replace('user.select-routine');
          }
        });

        var path = ['workouts', workout.$id, 'routine', 'lifts'];
        $scope.lifts = firebase.sync(path).$asArray();
        $scope.lifts.$loaded().then(function() {
          for (var i = 0; i < $scope.lifts.length; i++) {
            var lift = $scope.lifts[i];
            if (!lift.weight) {
              user.working_weight = user.working_weight || {};
              if (user.working_weight[lift.name]) {
                lift.weight = user.working_weight[lift.name];
              } else {
                lift.weight = lifts.getStartingWeight(lift.name);
              }
              $scope.lifts.$save(i);
            }

            $scope.$watch('lifts[' + i + ']', onLiftChange, true);
          }
        });

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

          if (startTimer) {
            $rootScope.restTimer.start(target, completed);
          } else {
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
            user.$save().then(function(ref) {
              $state.replace('user.index');
            });
          }
        };

        $scope.$on('workout.delete', function() {
          if (confirm('Are you sure you want to delete this workout?')) {
            delete user.current_workout;
            firebase.sync(['workouts', $scope.workout.$id]).$remove();
            user.$save().then(function(ref) {
              $state.replace('user.index');
            });
          }
        });
      }
    ]
  );
})();
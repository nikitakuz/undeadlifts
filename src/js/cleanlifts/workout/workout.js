cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.workout',
        {
          url: '/workout',
          templateUrl: 'partials/workout.html',
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
cleanlifts.controller('WorkoutController',
  [         '$rootScope', '$scope', '$state', '$filter', 'firebase', 'util', 'log', 'user', 'workout',
    function($rootScope,   $scope,   $state,   $filter,   firebase,   util,   log,   user,   workout) {
      $scope.restTimerTimeout = null;
      $scope.restTimerInterval = null;
      var timerSound = new Howl({ urls: ['mp3/chirp-chirp.mp3'] });
      $scope.showRestTimer = false;
      $scope.showChangeWeight = false;
      $scope.restTime = 0;

      if (!workout || !workout.routine) {
        $state.transitionTo('user.select-routine', {}, { location: 'replace' });
        return;
      }

      workout.$bindTo($scope, 'workout').then(function() {
        var valid = validateWorkout($scope.workout);
        if (!valid) {
          $state.transitionTo('user.select-routine', {}, { location: 'replace' });
          return;
        }
        $scope.date = parseDate($scope.workout.date);
        $scope.routine = $scope.workout.routine;
      });

      var path = ['workouts', user.current_workout, 'routine', 'lifts'];
      $scope.lifts = firebase.sync(path).$asArray();
      $scope.lifts.$loaded().then(function() {
        var lifts = $scope.lifts;
        for (var i = 0; i < lifts.length; i++) {
          var lift = lifts[i];
          if (!lift.completed || lift.completed.length !== lift.sets.length) {
            lift.completed = util.arrayFilledWithValues(lift.sets.length, -1);
            lifts.$save(i);
          }
        }
      });

      function validateWorkout(workout) {
        var valid = workout.date && workout.routine;
        if (valid) {
          return true;
        } else {
          delete user.current_workout;
          user.$save();
          return false;
        }
      }

      function parseDate(date) {
        var yyyy = date.substr(0, 4);
        var mm = date.substr(4, 2);
        var dd = date.substr(6, 2);
        return new Date(yyyy, mm - 1, dd);
      }

      $scope.$on('workout.change-date', function(event, newDate) {
        $scope.date = new Date(newDate);
        $scope.workout.date = $filter('date')(newDate, 'yyyyMMdd');
      });

      $scope.clearRestTimer = function() {
        clearTimeout($scope.restTimerTimeout);
        clearInterval($scope.restTimerInterval);
        $scope.restTime = 0;
        $scope.showRestTimer = false;
      };

      $scope.startRestTimer = function(reps, completed) {
        $scope.clearRestTimer();
        $scope.restTimerTimeout = setTimeout(function() {
          $scope.$apply(function() {
            $scope.showRestTimer = true;
            $scope.rest_message_1 = getRestMessage1(reps, completed);
            $scope.rest_message_2 = getRestMessage2(reps, completed);
          });
          $scope.restTimerInterval = setInterval(function() {
            $scope.$apply(function() {
              $scope.restTime += 1000;
              if ($scope.restTime === 90 * 1000 || $scope.restTime === 180 * 1000) {
                timerSound.play();
              }
            });
          }, 1000);
        }, 1500);
      };

      function getRestMessage1(reps, completed) {
        return reps === completed ? 'Congrats getting ' + reps + ' reps!' : 'Failing is part of the game!';
      }

      function getRestMessage2(reps, completed) {
        return reps === completed ?
          'If it was easy, rest 90 sec. If not, 3 min.' :
          'Rest 5 mins and you\'ll get your next set.';
      }

      $scope.finishWorkout = function() {
        var date = $scope.workout.date;
        user.history = user.history || {};
        user.history[date] = user.history[date] || {};
        user.history[date]= user.current_workout;
        delete user.current_workout;
        user.$save().then(function(ref) {
            $state.transitionTo('user.index', {}, {});
        });
      };
    }
  ]
);
cleanlifts.controller('LiftController',
  [         '$scope',
    function($scope) {
      console.log($scope.lift);
      $scope.classname = { 1: 'one-set', 2: 'two-sets', 3: 'three-sets', 4: 'four-sets', 5: 'five-sets' }[$scope.lift.sets.length];

      $scope.updateSet = function(si) {
        var lift = $scope.lift;
        if (lift.completed[si] > -1) {
          lift.completed[si]--;
        } else {
          lift.completed[si] = $scope.lift.sets[si];
        }
        $scope.lifts.$save($scope.$index);
        if (!isLiftComplete(lift) && lift.completed[si] !== -1) {
          $scope.startRestTimer(lift.sets[si], lift.completed[si]);
        } else {
          $scope.clearRestTimer();
        }
      };

      function isLiftComplete(lift) {
        var complete = true;
        for (var i = 0; i < lift.completed.length; i++) {
          if (lift.completed[i] === -1) {
            complete = false;
          }
        }
        return complete;
      }
    }
  ]
);

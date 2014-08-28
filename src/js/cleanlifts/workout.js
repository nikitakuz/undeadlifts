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
          controller: 'WorkoutController'
        }
      );

      $stateProvider.state('user.workout.change-date',
        {
          url: '/change-date',
          templateUrl: 'partials/workout/change-date.html',
          controller: 'ChangeDateController'
        }
      );

      $stateProvider.state('user.workout.change-weight',
        {
          url: '/change-weight/:lift',
          templateUrl: 'partials/workout/change-weight.html',
          controller: 'ChangeWeightController'
        }
      );
    }
  ]
);
cleanlifts.service('workout',
  [         '$firebase', '$filter', 'FBREF',
    function($firebase,   $filter,   FBREF) {
      var workouts = FBREF.child('workouts');

      return {
        create: function(routine, onComplete) {
          var now = new Date();
          var workout = {
            routine: routine,
            timestamp: now.getTime(),
            date: $filter('date')(now, 'yyyyMMdd')
          };
          var ref = workouts.push(workout, function(err) {
            if (err) {
              onComplete(new Error('Could not create workout.'), false);
            } else {
              onComplete(false, ref.name());
            }
          });
        },
        sync: function(refId) {
          return $firebase(workouts.child(refId)).$asObject();
        }
      }
    }
  ]
);
cleanlifts.controller('SelectRoutineController',
  [         '$scope', '$state', '$filter', 'log', 'user', 'routines', 'workout',
    function($scope,   $state,   $filter,   log,   user,   routines,   workout) {
      log('Waiting for user to select a routine...');
      $scope.routines = routines;

      $scope.selectRoutine = function(routine) {
        log('User selected a routine.');
        log('Routine chosen: ' + routine.name);
        // Remove firebase properties($id, $priority) and protect against unintentional modification.
        var copy = { name: routine.name, lifts: JSON.parse(JSON.stringify(routine.lifts)) };
        workout.create(copy, function(err, refId) {
            if (!err) {
              user.current_workout = refId;
              user.$save();
              $state.transitionTo('user.workout', {}, {});
            } else {
              console.log('Failed to create a workout.');
            }
          }
        );
      };
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

      if (!user.current_workout) {
        $state.transitionTo('user.select-routine', {}, { location: 'replace' });
        return;
      }

      var path = ['workouts', user.current_workout];
      var workout = firebase.sync(path).$asObject();
      workout.$bindTo($scope, 'workout').then(function() {
        var valid = validateWorkout($scope.workout);
        if (!valid) {
          $state.transitionTo('user.select-routine', {}, { location: 'replace' });
          return;
        }
        $scope.date = parseDate($scope.workout.date);
        $scope.routine = $scope.workout.routine;
      });

      $scope.lifts = firebase.sync(path.concat(['routine', 'lifts'])).$asArray();
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
        var valid = workout.date && workout.routine
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
      }

      function getRestMessage1(reps, completed) {
        return reps === completed ? 'Congrats getting ' + reps + ' reps!' : 'Failing is part of the game!'
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
        user.history[date][user.current_workout] = true;
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
cleanlifts.controller('ChangeDateController',
  [         '$rootScope', '$scope',
    function($rootScope,   $scope) {
      $scope.selected_date = $scope.date;
      $scope.$watch('selected_date', function(newVal, oldVal) {
        if (newVal === oldVal || !(newVal instanceof Date)) {
          return;
        }
        $rootScope.$broadcast('workout.change-date', newVal);
        window.history.back();
      });

    }
  ]
);

cleanlifts.controller('ChangeWeightController',
  [         '$scope', '$state', '$stateParams',
    function($scope,   $state,   $stateParams) {
      $scope.lift = $stateParams['lift'];
      $scope.weight = Number($scope.user.working_weight[$scope.lift]);
      $scope.plates = {};

      calculatePlates();

      $scope.decreaseWeight = function() {
        $scope.weight = $scope.weight - 5;
        calculatePlates();
      };

      $scope.increaseWeight = function() {
        $scope.weight = $scope.weight + 5;
        calculatePlates();
      };

      $scope.saveWeight = function() {
        $scope.user.working_weight[$scope.lift] = $scope.weight;
        $scope.user.$save();
        window.history.back();
      };

      $scope.cancelChanges = function() {
        window.history.back();
      };

      function calculatePlates() {
        var each_side = ($scope.weight - 45) / 2;
        var plates = {'45': 0, '35': 0, '25': 0, '10': 0, '5': 0, '2.5': 0};
        while (each_side > 0) {
          if (each_side >= 45) {
            plates['45']++;
            each_side -= 45;
          } else if (each_side >= 35) {
            plates['35']++;
            each_side -= 35;
          } else if (each_side >= 25) {
            plates['25']++;
            each_side -= 25;
          } else if (each_side >= 10) {
            plates['10']++;
            each_side -= 10;
          } else if (each_side >= 5) {
            plates['5']++;
            each_side -= 5;
          } else if (each_side >= 2.5) {
            plates['2.5']++;
            each_side -= 2.5;
          } else {
            break;
          }
        }
        $scope.plates = plates;
      }
    }
  ]
);

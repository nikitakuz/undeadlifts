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

      $stateProvider.state('user.workout.change-date',
        {
          url: '/workout/change-date',
          templateUrl: 'partials/workout/change-date.html',
          controller: 'ChangeDateController'
        }
      );

      $stateProvider.state('user.workout.change-weight',
        {
          url: '/workout/change-weight/:lift',
          templateUrl: 'partials/workout/change-weight.html',
          controller: 'ChangeWeightController'
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
        var now = new Date();
        var date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        user.current_routine = {
          name: routine.name, lifts: routine.lifts, date: date
        };
        user.$save();
        $state.transitionTo('user.workout', {}, {});
      };
    }
  ]
);
cleanlifts.controller('WorkoutController',
  [         '$scope', '$state', '$filter', '$firebase', 'log', 'user', 'history',
    function($scope,   $state,   $filter,   $firebase, log,   user,   history) {
      if (!user.current_routine) {
        $state.transitionTo('user.select-routine', {}, { location: 'replace' });
        return;
      }
      $scope.date = Date.parse(user.current_routine.date);
      $scope.routine = user.current_routine;
      $scope.weight_unit = user.weight_unit;
      $scope.showChangeWeight = false;

      $scope.$on('workout.change-date', function(event, newDate) {
        user.current_routine.date = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()
        user.$save();
        $scope.date = Date.parse(user.current_routine.date);
      });

      $scope.lifts = $scope.routine.lifts.map(function(val, i, array) {
        var split = val.sets.split('x');
        var num_sets = split[0];
        var num_reps = split[1];
        var pluralized = { 1: 'one-set', 2: 'two-sets', 3: 'three-sets', 4: 'four-sets', 5: 'five-sets' }[split[0]];
        var completed = createArrayFilledWithNumber(num_sets, -1);
        return { name: val.name, classname: pluralized, sets: num_sets, reps: num_reps, completed: completed };
      });

      $scope.updateSet = function(lift, si) {
        if (lift.completed[si] > -1) {
          lift.completed[si]--;
        } else {
          lift.completed[si] = lift.reps;
        }
      };

      $scope.changeWeight = function(lift_name) {
        $state.transitionTo('user.workout.change-weight');
      };

      $scope.finishWorkout = function() {
        var lifts = $scope.lifts.map(function(lift, i) {
          delete lift.$$hashKey;
          lift.weight = user.working_weight[lift.name];
          return lift;
        });
        var workout = {
          date: $scope.routine.date,
          routine_name: $scope.routine.name,
          lifts: lifts
        };
        history.$add(workout).then(function(ref) {
          var f = $firebase(ref).$asObject();
          // ** Strange bug! ** $priority cannot be set before initial $save().
          f.$save().then(function() {
            f.$priority = Number(workout.date.replace(/-/g, ''));
            f.$save();
          });
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
cleanlifts.controller('ChangeDateController',
  [         '$rootScope', '$scope', '$state', '$stateParams',
    function($rootScope,   $scope,   $state,   $stateParams) {
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

      $scope.decreaseWeight = function() {
        $scope.weight = $scope.weight - 5;
      };

      $scope.increaseWeight = function() {
        $scope.weight = $scope.weight + 5;
      };

      $scope.saveWeight = function() {
        $scope.user.working_weight[$scope.lift] = $scope.weight;
        $scope.user.$save();
        window.history.back();
      };

      $scope.cancelChanges = function() {
        window.history.back();
      };
    }
  ]
);

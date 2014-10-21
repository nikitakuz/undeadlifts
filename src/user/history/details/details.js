(function() {
  var details = angular.module('undeadlifts.user.history.details',
    [
      'ui.router',
      'undeadlifts.user.workout'
    ]
  );

  details.config(
    [         '$stateProvider',
      function($stateProvider) {
        function stateParamsToYyyyMmDd($stateParams) {
          var year = parseInt($stateParams.year);
          var month = parseInt($stateParams.month);
          var day = parseInt($stateParams.day);
          return year * 10000 + month * 100 + day; // e.g. 20140827
        }
        $stateProvider.state('user.history.details',
          {
            url: '/{day:[0-9]{1,2}}',
            templateUrl: 'user/workout/workout.html',
            controller: 'HistoryWorkoutController',
            resolve: {
              workout: ['$stateParams', 'firebase', 'user', function($stateParams, firebase, user) {
                var yyyyMmDd = stateParamsToYyyyMmDd($stateParams);
                var id = user.history[yyyyMmDd];
                if (!id) { return false; }
                return firebase.sync(['workouts', id]).$asObject().$loaded();
              }]
            }
          }
        );
        $stateProvider.state('user.history.details.change-date',
          {
            url: '/change-date',
            templateUrl: 'user/workout/change-date/change-date.html',
            controller: 'WorkoutChangeDateController'
          }
        );
        $stateProvider.state('user.history.details.change-weight',
          {
            url: '/change-weight/:lift',
            templateUrl: 'user/workout/change-weight/change-weight.html',
            controller: 'ChangeWeightController'
          }
        );
      }
    ]
  );

  details.controller('HistoryWorkoutController',
    [         '$window', '$scope', '$state', '$stateParams', '$filter', 'firebase', 'user', 'workout',
      function($window,   $scope,   $state,   $stateParams,   $filter,   firebase,   user,   workout) {
        if (!workout || !workout.routine) {
          replaceStateWithUserHistoryMonth();
          return;
        }
        $scope.workout = workout;
        $scope.lifts = workout.routine.lifts;
        $scope.date = new Date($stateParams.year, $stateParams.month - 1, $stateParams.day);

        $scope.selectNewDate = function(date) {
          $scope.new_date = date;
        };

        $scope.updateWorkout = function() {
          // TODO: figure out a way to not have this be copy-paste logic. Bleh!
          if ($scope.new_date && $scope.new_date.getTime() !== $scope.date.getTime()) {
            var yyyymmdd = $filter('date')($scope.new_date, 'yyyyMMdd');
            user.history = user.history || {};
            var workout_exists = typeof user.history[yyyymmdd] === 'string';
            if (workout_exists && user.history[yyyymmdd] !== $scope.workout.$id) {
              if (confirm('A workout already exists for this date. Do you want to overwrite it with this one?')) {
                changeWorkoutDate(yyyymmdd);
                saveWorkout();
              }
            } else {
              changeWorkoutDate(yyyymmdd);
              saveWorkout();
            }
          } else {
            saveWorkout();
          }

          function changeWorkoutDate(yyyymmdd) {
            user.history[yyyymmdd] = $scope.workout.$id;
            delete user.history[$filter('date')($scope.date, 'yyyyMMdd')];
            user.$save();
          }

          function saveWorkout() {
            // Remove $$hashKey attributes from lifts before $save()-ing to firebase.
            $scope.workout.routine.lifts = angular.copy($scope.workout.routine.lifts);
            $scope.workout.$save();
            if ($window.history && $window.history.back) {
              $window.history.back();
            } else {
              replaceStateWithUserHistoryMonth();
            }
          }
        };

        $scope.$on('workout.delete', function() {
          if (confirm('Are you sure you want to delete this workout?')) {
            firebase.sync(['workouts', $scope.workout.$id]).$remove();
            delete user.history[$filter('date')($scope.date, 'yyyyMMdd')];
            user.$save().then(function() {
              if ($window.history && $window.history.back) {
                $window.history.back();
              } else {
                replaceStateWithUserHistoryMonth();
              }
            });
          }
        });

        function replaceStateWithUserHistoryMonth() {
          $state.replace('user.history', { year: $stateParams.year, month: $stateParams.month });
        }
      }
    ]
  );
})();
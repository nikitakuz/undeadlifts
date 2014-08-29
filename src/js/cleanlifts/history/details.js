cleanlifts.config(
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
          url: '/{year:[0-9]{4}}/{month:[0-9]{1,2}}/{day:[0-9]{1,2}}',
          templateUrl: 'partials/workout.html',
          controller: 'WorkoutController',
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
          templateUrl: 'partials/workout/change-date.html',
          controller: 'ChangeDateController',
          resolve: {
            'date': ['$stateParams', 'firebase', 'user', function($stateParams, firebase, user) {
              var yyyyMmDd = stateParamsToYyyyMmDd($stateParams);
              var id = user.history[yyyyMmDd];
              if (!id) { return false; }
              return firebase.sync(['workouts', id, 'date']).$asObject().$loaded();
            }]
          }
        }
      );
      $stateProvider.state('user.history.details.change-weight',
        {
          url: '/change-weight/:lift',
          templateUrl: 'partials/workout/change-weight.html',
          controller: 'ChangeWeightController'
        }
      );
    }
  ]
);
cleanlifts.controller('HistoryDetailsController',
  [         '$scope', '$state', '$stateParams', '$filter', 'firebase', 'workout',
    function($scope,   $state,   $stateParams,   $filter,   firebase,   workout) {
      if (!workout || !workout.routine) {
        $state.transitionTo(
          'user.history.month',
          { year: $stateParams.year, month: $stateParams.month },
          { location: 'replace' }
        );
        return;
      }
      $scope.workout = workout;
      $scope.lifts = workout.routine.lifts;
      $scope.date = new Date($stateParams.year, $stateParams.month - 1, $stateParams.day);
    }
  ]
);

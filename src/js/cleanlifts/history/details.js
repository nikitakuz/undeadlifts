cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.history.details',
        {
          url: '/{year:[0-9]{4}}/{month:[0-9]{1,2}}/{day:[0-9]{1,2}}',
          templateUrl: 'partials/workout.html',
          controller: 'HistoryDetailsController',
          resolve: {
            workout: ['$stateParams', 'firebase', 'user', function($stateParams, firebase, user) {
              var year = parseInt($stateParams.year);
              var month = parseInt($stateParams.month);
              var day = parseInt($stateParams.day);
              var id = user.history[year * 10000 + month * 100 + day]; // e.g. 20140827
              if (!id) { return false; }
              return firebase.sync(['workouts', id]).$asObject().$loaded();
            }]
          }
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
      $scope.date = new Date($stateParams.year, $stateParams.month, $stateParams.day);
    }
  ]
);

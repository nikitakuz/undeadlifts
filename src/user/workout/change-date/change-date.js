undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.workout.change-date',
        {
          url: '/change-date',
          templateUrl: 'user/workout/change-date/change-date.html',
          controller: 'WorkoutChangeDateController'
        }
      );
    }
  ]
);
undeadlifts.controller('WorkoutChangeDateController',
  [         '$rootScope', '$scope', '$timeout', '$state', '$filter', 'util', 'user', 'workout',
    function($rootScope,   $scope,   $timeout,   $state,   $filter,   util,   user,   workout) {
      $scope.current_date = util.parseYyyyMmDd(workout.yyyymmdd);
      $scope.changeDate = function(date) {
        if (date !== $scope.current_date) {
          $scope.workout.yyyymmdd = $filter('date')(date, 'yyyyMMdd');
        }
        $state.back();
      };
    }
  ]
);


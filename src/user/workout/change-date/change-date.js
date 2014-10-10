(function() {
  var changeDate = angular.module('undeadlifts.user.workout.change-date', []);

  changeDate.config(
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

  changeDate.controller('WorkoutChangeDateController',
    [         '$rootScope', '$scope', '$state', '$stateParams', '$filter', 'util', 'workout',
      function($rootScope,   $scope,   $state,   $stateParams,   $filter,   util,   workout) {
        if ($state.includes('user.workout')) {
          $scope.current_date = util.parseYyyyMmDd(workout.yyyymmdd);
        } else if ($state.includes('user.history')) {
          $scope.current_date = $scope.new_date || new Date($stateParams.year, $stateParams.month - 1, $stateParams.day);
        } else {
          console.log('WARNING: Unsupported state.');
        }
        $scope.changeDate = function(date) {
          if (date !== $scope.current_date) {
            $scope.selectNewDate(date);
          }
          $state.back();
        };
      }
    ]
  );
})();


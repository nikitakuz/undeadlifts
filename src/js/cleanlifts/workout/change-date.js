cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.workout.change-date',
        {
          url: '/change-date',
          templateUrl: 'partials/workout/change-date.html',
          controller: 'WorkoutChangeDateController'
        }
      );
    }
  ]
);
cleanlifts.controller('WorkoutChangeDateController',
  [         '$rootScope', '$scope', '$timeout', '$state', '$filter', 'util', 'user', 'workout',
    function($rootScope,   $scope,   $timeout,   $state,   $filter,   util,   user,   workout) {
      $scope.current_date = util.parseYyyyMmDd(workout.yyyymmdd);
      $scope.selected_date = $scope.current_date;
      $scope.changeDate = function() {
        if ($scope.selected_date === $scope.current_date) {
          return;
        }
        $scope.workout.yyyymmdd = $filter('date')($scope.selected_date, 'yyyyMMdd');
        window.history.back();
/*
        $scope.workout.$save().then(function() {
//          $scope.setDate(newDate);
        });
*/
      };
    }
  ]
);


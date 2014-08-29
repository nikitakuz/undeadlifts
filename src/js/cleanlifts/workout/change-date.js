cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.workout.change-date',
        {
          url: '/change-date',
          templateUrl: 'partials/workout/change-date.html',
          controller: 'ChangeDateController'
        }
      );
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


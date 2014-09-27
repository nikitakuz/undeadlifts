undeadlifts.controller('NavController',
  [         '$window', '$rootScope', '$scope', '$state',
    function($window,   $rootScope,   $scope,   $state) {
      $scope.showMenu = false;
      $scope.now = new Date();

      $scope.$on('$stateChangeSuccess', function(e, state) {
        $scope.showMenu = false;
        if ($state.includes('user.index')) {
          $scope.title = 'UndeadLifts';
        } else if ($state.includes('user.create-routine.index')) {
          $scope.title = 'Create Routine';
        } else if ($state.includes('user.create-routine.add-lift')) {
          $scope.title = 'Add Lift';
        } else if ($state.includes('user.select-routine')) {
          $scope.title = 'Select Routine';
        } else if ($state.includes('user.workout')) {
          $scope.title = 'Workout';
        } else if ($state.includes('user.history')) {
          $scope.title = 'History';
        } else if ($state.includes('user.settings')) {
          $scope.title = 'Settings';
        }
      });

      $scope.switchHistoryView = function() {
        // TODO: write and use this function
      };

      $scope.deleteWorkout = function() {
        $rootScope.$broadcast('workout.delete');
      };

      $scope.back = function() {
        var historySupport = $window.history && $window.history.back;

        if (historySupport) {
          $window.history.back();
          return;
        }

        switch ($state.current.name) {
          case 'user.history.details':
            delete $state.params.day;
            $state.go('user.history.month', $state.params);
            break;
          default:
            $state.go('user.index');
            break;
        }
      };
    }
  ]
);
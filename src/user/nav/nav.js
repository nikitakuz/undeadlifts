undeadlifts.controller('NavController',
  [         '$window', '$rootScope', '$scope', '$state',
    function($window,   $rootScope,   $scope,   $state) {
      $scope.showMenu = false;
      $scope.now = new Date();

      $scope.$on('$stateChangeSuccess', function(e, state) {
        $scope.showMenu = false;
      });

      $scope.getTitle = function(stateCurrentName) {
        return stateCurrentName.split('.')[1].replace(/-/g, ' ');
      };

      $scope.toggleHistoryMode = function() {
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
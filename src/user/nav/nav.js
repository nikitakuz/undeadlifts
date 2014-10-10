undeadlifts.controller('NavController',
  [         '$window', '$rootScope', '$scope', '$state',
    function($window,   $rootScope,   $scope,   $state) {
      $scope.showMenu = false;
      $scope.now = new Date();

      $scope.$on('$stateChangeSuccess', function(e, state) {
        $scope.showMenu = false;
      });

      $scope.getTitle = function() {
        return $state.current.name.split('.')[1].replace(/-/g, ' ');
      };

      $scope.toggleHistoryMode = function() {
        // TODO: write and use this function
      };

      $scope.deleteWorkout = function() {
        $rootScope.$broadcast('workout.delete');
      };
    }
  ]
);
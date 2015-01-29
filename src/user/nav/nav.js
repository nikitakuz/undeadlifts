(function() {
  var nav = angular.module('undeadlifts.user.nav', []);

  nav.controller('NavController',
    [         '$window', '$rootScope', '$scope', '$state',
      function($window,   $rootScope,   $scope,   $state) {
        $scope.showMenu = false;
        $scope.now = new Date();

        $scope.$on('$stateChangeSuccess', function(e, state) {
          $scope.showMenu = false;
        });

        $scope.toggleHistoryMode = function() {
          // TODO: write and use this function
        };
      }
    ]
  );
})();

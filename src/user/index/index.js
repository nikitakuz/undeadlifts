(function() {
  var index = angular.module('undeadlifts.user.index', []);

  index.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.index',
          {
            url: '/',
            templateUrl: 'user/index/index.html',
            controller:
              [         '$rootScope', '$scope',
                function($rootScope,   $scope) {
                  $scope.now = new Date();
                }
              ]
          }
        );
      }
    ]
  );
})();
cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');

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
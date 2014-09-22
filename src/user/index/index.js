cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider.state('user.index',
        {
          url: '/',
          templateUrl: 'user/index/index.html',
          controller:
            [         '$scope',
              function($scope) {
                $scope.now = new Date();
              }
            ]
        }
      );
    }
  ]
);
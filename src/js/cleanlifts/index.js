cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.index',
        {
          url: '/',
          templateUrl: 'partials/index.html',
          controller: 'indexController',
        }
      );
    }
  ]
);

cleanlifts.controller('indexController',
  [         '$scope',
    function($scope) {
      $scope.now = new Date();
    }
  ]
);

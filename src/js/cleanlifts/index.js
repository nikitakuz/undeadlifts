cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.index',
        {
          url: '/',
          templateUrl: 'partials/index.html',
          controller: 'indexController',
          authRequired: true
        }
      );
    }
  ]
);

cleanlifts.controller('indexController',
  [         '$scope',
    function($scope) {
    }
  ]
);

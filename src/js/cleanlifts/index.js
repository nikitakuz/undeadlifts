cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('index',
        {
          url: '/',
          templateUrl: 'partials/index.html',
          controller: 'indexController'
        }
      );
    }
  ]
);

cleanlifts.controller('indexController',
  [         '$rootScope', '$scope', '$state', '$stateParams', 'auth', 'replaceState',
    function($rootScope,   $scope,   $state,   $stateParams,   auth,   replaceState) {
    }
  ]
);

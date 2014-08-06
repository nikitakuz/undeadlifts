cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('index',
        {
          url: '/',
          templateUrl: 'partials/index.html',
          controller: 'indexController',
          resolve: {
            auth: ['auth', function(auth) { return auth; }]
          }
        }
      );
    }
  ]
);

cleanlifts.controller('indexController',
  [         '$rootScope', '$scope', '$state', 'auth',
    function($rootScope,   $scope,   $state,   auth) {
      $scope.auth = auth;
      if (!auth.user) {
        $state.transitionTo('login', { b: 'index' }, {location: 'replace'});
      }
    }
  ]
);

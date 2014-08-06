cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider.state('login',
        {
          url: '/login?b',
          templateUrl: 'partials/login.html',
          controller: 'LoginController',
          resolve: {
            auth: ['auth', function(auth) { return auth; }]
          }
        }
      );
    }
  ]
);

cleanlifts.controller('LoginController',
  [         '$rootScope', '$scope', '$state', '$stateParams', 'replaceState', 'logger', 'auth',
    function($rootScope,   $scope,   $state,   $stateParams,   replaceState,   logger,   auth) {
      $scope.auth = auth;

      if ($rootScope.user) {
        replaceState($stateParams.b || 'index');
      }

      $scope.login = function() {
        auth.login($scope.email, $scope.password);
        $scope.password = '';
      };

      $scope.$on('auth.login', function() {
        replaceState($stateParams.b || 'index');
      });
    }
  ]
);
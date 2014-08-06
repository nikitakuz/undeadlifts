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
  [         '$scope', '$state', '$stateParams', 'logger', 'auth',
    function($scope,   $state,   $stateParams,   logger,   auth) {
      $scope.auth = auth;
      if (auth.user) {
        replaceState($stateParams.b || 'index');
      }

      $scope.login = function() {
        auth.login($scope.email, $scope.password);
        $scope.password = '';
      };

      $scope.$on('auth.login', function() {
        replaceState($stateParams.b || 'index');
      });

      function replaceState(state) {
        $state.transitionTo($stateParams.b || 'index', {}, {location: 'replace'});
      }
    }
  ]
);
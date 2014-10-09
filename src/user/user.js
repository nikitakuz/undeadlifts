undeadlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider.state('user',
        {
          abstract: true,
          templateUrl: 'user/user.html',
          controller: 'AbstractUserController',
          resolve: {
            simpleLogin: ['simpleLogin', function(simpleLogin) {
              return simpleLogin.getInitPromise();
            }],
            user: ['simpleLogin', 'firebase', 'state', function(simpleLogin, firebase, state) {
              if (!simpleLogin.user || !simpleLogin.user.uid) {
                state.replace('login');
                return;
              }
              var uid = simpleLogin.user.uid;
              return firebase.sync(['users', uid]).$asObject().$loaded();
            }]
          }
        }
      );
    }
  ]
);

undeadlifts.controller('AbstractUserController',
  [         '$scope', 'state', 'simpleLogin', 'user',
    function($scope,   state,   simpleLogin,   user) {
      $scope.logout = function() {
        simpleLogin.logout();
      };

      $scope.user = user;
      $scope.state = state;
      $scope.weight_unit = simpleLogin.user.weight_unit;

      $scope.$on('simpleLogin.logout', function() {
        state.replace('login');
      });
    }
  ]
);
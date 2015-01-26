(function() {
  var user = angular.module('undeadlifts.user',
    [
      'ui.router',
      'undeadlifts.login',
      'undeadlifts.state-decorator',
      'undeadlifts.templates',
      'undeadlifts.firebase',
      'undeadlifts.user.nav',
      'undeadlifts.user.index',
      'undeadlifts.user.select-routine',
      'undeadlifts.user.workout',
      'undeadlifts.user.routine',
      'undeadlifts.user.history',
      'undeadlifts.user.settings'
    ]
  );

  user.config(
    [         '$stateProvider', '$urlRouterProvider',
      function($stateProvider,   $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('user',
          {
            abstract: true,
            templateUrl: 'user/user.html',
            controller: 'AbstractUserController',
            resolve: {
              firebase: ['firebase', function(firebase) {
                return firebase.getInitPromise();
              }],
              auth: ['firebase', function(firebase) {
                return firebase.getAuth();
              }],
              user: ['$state', 'auth', 'firebase', function($state, auth, firebase) {
                if (!auth || !auth.uid) {
                  $state.replaceWithLogin();
                  return;
                }
                return firebase.sync(['users', auth.uid]).$asObject().$loaded();
              }]
            }
          }
        );
      }
    ]
  );

  user.controller('AbstractUserController',
    [         '$rootScope', '$scope', '$state', 'firebase', 'auth', 'user',
      function($rootScope,   $scope,   $state,   firebase,   auth,   user) {
        $scope.auth = auth;
        $scope.user = user;

        $scope.logout = function() {
          firebase.unauth();
          $state.replaceWithLogin();
        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (toState.name === 'user.history' && fromState.name === 'user.index') {
            $rootScope.historyView = 'calendar';
          }
        });
      }
    ]
  );
})();


(function() {
  var user = angular.module('undeadlifts.user',
    [
      'undeadlifts.firebase',
      'undeadlifts.user.nav',
      'undeadlifts.user.index',
      'undeadlifts.user.create-routine',
      'undeadlifts.user.select-routine',
      'undeadlifts.user.workout',
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
              user: ['$state', 'firebase', function($state, firebase) {
                var auth = firebase.getAuth();
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
    [         '$scope', '$state', 'firebase', 'user',
      function($scope,   $state,   firebase,   user) {
        $scope.user = user;

        $scope.logout = function() {
          firebase.unauth();
          $state.replaceWithLogin();
        };
      }
    ]
  );
})();


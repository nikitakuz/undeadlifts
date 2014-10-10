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
              user: ['$state', 'firebase', 'replaceState', function($state, firebase, replaceState) {
                var auth = firebase.getAuth();
                if (!auth || !auth.uid) {
                  var back = (window.location.hash || '').replace('#', '');
                  $state.replace('login', {b: back});
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
          var b = (location.hash || '').replace('#', '');
          $state.replace('login', {b: b});
        };
      }
    ]
  );
})();


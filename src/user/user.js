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
            firebase: ['firebase', function(firebase) {
              return firebase.getInitPromise();
            }],
            user: ['$state', 'firebase', 'replaceState', function($state, firebase, replaceState) {
              var auth = firebase.getAuth();
              if (!auth || !auth.uid) {
                var back = (window.location.hash || '').replace('#', '');
                replaceState('login', {b: back});
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

undeadlifts.controller('AbstractUserController',
  [         '$scope', 'state', 'firebase', 'user', 'replaceState',
    function($scope,   state,   firebase,   user,   replaceState) {
//      debugger;

      $scope.logout = function() {
        firebase.unauth();
        var b = (location.hash || '').replace('#', '');
        replaceState('login', {b: b});
//        simpleLogin.logout();
      };

      $scope.user = user;
      $scope.state = state;
    }
  ]
);
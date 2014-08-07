(function() {
  var fb = new Firebase('https://cleanlifts.firebaseio.com');
  var fbsl = new FirebaseSimpleLogin(fb, function(error, user) {
    if (error) {
      console.log(error);
    } else if (user) {
      console.log('User logged in. Redirecting to app...');
      if (location.replace) {
        location.replace('/');
      } else {
        location.href = '/';
      }
    } else {
      console.log('No user found. Bootstrapping login module...')
      angular.element(document).ready(function() {
        angular.bootstrap(document, ['login']);
      });
    }
  });

  var login = angular.module('login', ['firebase'])
  login.controller('LoginController',
    [         '$scope',
      function($scope) {
        $scope.login = function() {
          fbsl.login('password', { email: $scope.email, password: $scope.password, rememberMe: true });
          $scope.password = '';
        }
      }
    ]
  );
})();

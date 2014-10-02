(function() {
  var login = angular.module('login', ['firebase']);
  var loginControllerScope;
  login.controller('LoginController',
    [         '$scope', '$timeout',
      function($scope,   $timeout) {
        loginControllerScope = $scope;
        $scope.focusEmail = true;
        $scope.focusPassword = false;
        $scope.emailError = false;
        $scope.passwordError = false;

        $scope.loginButtonText = 'Login to my account';

        $scope.login = function() {
          $scope.loginButtonText = 'Logging in...';
          fbsl.login('password', { email: $scope.email, password: $scope.password, rememberMe: true });
//          $scope.password = '';
        };

        $scope.handleError = function(error) {
          $scope.loginButtonText = 'Login to my account';
          $scope.emailError = false;
          $scope.passwordError = false;
          var message = {
            'INVALID_EMAIL': 'The email address entered is invalid.',
            'INVALID_USER': 'No account exists for this email address.',
            'INVALID_PASSWORD': 'The password entered is incorrect.'
          }[error.code];
          if (error.code === 'INVALID_EMAIL' || error.code === 'INVALID_USER') {
            $scope.emailError = true;
            focusEmail();
          } else if (error.code === 'INVALID_PASSWORD') {
            $scope.passwordError = true;
            focusPassword();
          }
        };

        $scope.$watch('form.email.$viewValue', function(newVal, oldVal) {
          if ($scope.emailError && newVal !== oldVal) {
            $scope.emailError = false;
          }
        });

        $scope.$watch('form.password.$viewValue', function(newVal, oldVal) {
          if ($scope.passwordError && newVal !== oldVal) {
            $scope.passwordError = false;
          }
        });

        function focusEmail() {
          $scope.$apply(function() {
            $scope.focusEmail = true;
          });
        }

        function focusPassword() {
          $scope.$apply(function() {
            $scope.focusPassword = true;
          });
        }
      }
    ]
  );

  login.directive('focus',
    function() {
      return {
        restrict: 'A',
        scope: { focus: '=focus' },
        link: function(scope, element, attrs) {
          scope.$watch('focus', function(newVal, oldVal) {
            if (scope.focus) {
              element[0].focus()
              element[0].select();
              scope.focus = false;
            }
          });
        }
      }
    }
  );

  var fb = new Firebase('https://undeadlifts.firebaseio.com');
  var fbsl = new FirebaseSimpleLogin(fb, function(error, user) {
    if (error) {
      if (loginControllerScope) {
        loginControllerScope.handleError(error);
      } else {
        console.log(error);
      }
    } else if (user) {
      console.log('User logged in. Redirecting to app...');
      if (location.replace) {
        location.replace('/' + window.location.hash);
      } else {
        location.href = '/'  + window.location.hash;
      }
    } else {
      console.log('No user found. Bootstrapping login module...');
      angular.element(document).ready(function() {
        angular.bootstrap(document, ['login']);
      });
    }
  });
})();

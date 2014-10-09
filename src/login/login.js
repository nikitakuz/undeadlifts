undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('login',
        {
          url: '/login',
          templateUrl: 'login/index.html',
          resolve: {
            simpleLogin: [ 'simpleLogin',
              function(simpleLogin) {
                return simpleLogin.getInitPromise();
              }
            ]
          },
          controller: 'LoginController'
        }
      );
    }
  ]
);

undeadlifts.controller('LoginController',
  [         '$scope', 'state', 'simpleLogin',
    function($scope,   state,   simpleLogin) {
      if (simpleLogin.user) {
        state.replace('user.index');
        return;
      }

      $scope.focusEmail = true;
      $scope.focusPassword = false;
      $scope.emailError = false;
      $scope.passwordError = false;
      $scope.loginButtonText = 'Login to my account';

      $scope.login = function() {
        $scope.loginButtonText = 'Logging in...';
        simpleLogin.login('password', { email: $scope.email, password: $scope.password, rememberMe: true });
      };

      $scope.$on('simpleLogin.error', function(event, error) {
        $scope.handleError(error);
      });

      $scope.$on('simpleLogin.login', function(event, error) {
        state.replace('user.index');
      });

      $scope.handleError = function(error) {
        $scope.loginButtonText = 'Login to my account';
        $scope.emailError = false;
        $scope.passwordError = false;
/*
        var message = {
          'INVALID_EMAIL': 'The email address entered is invalid.',
          'INVALID_USER': 'No account exists for this email address.',
          'INVALID_PASSWORD': 'The password entered is incorrect.'
        }[error.code];
*/
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
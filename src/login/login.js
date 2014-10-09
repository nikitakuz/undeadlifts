undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('login',
        {
          url: '/login?b',
          templateUrl: 'login/index.html',
          controller: 'LoginController',
          resolve: {
            firebase: ['firebase', function(firebase) {
              return firebase.getInitPromise();
            }],
            user: ['firebase', 'replaceState', function(firebase, replaceState) {
              var auth = firebase.getAuth();
              if (auth && auth.uid) {
                replaceState('user.index');
              }
            }]
          }
        }
      );
    }
  ]
);

undeadlifts.controller('LoginController',
  [         '$scope', '$state', '$location', 'firebase', 'user', 'replaceState',
    function($scope,   $state,   $location,   firebase,   user,   replaceState) {
      $scope.focusEmail = true;
      $scope.focusPassword = false;
      $scope.emailError = false;
      $scope.passwordError = false;
      $scope.loginButtonText = 'Login to my account';

      $scope.login = function() {
        $scope.loginButtonText = 'Logging in...';
        var credentials = { email: $scope.email, password: $scope.password };
//        simpleLogin.login('password', { email: $scope.email, password: $scope.password, rememberMe: true });
        firebase.authWithPassword(credentials, function(error, user) {
          if (error) {
            $scope.handleError(error);
          } else if (user) {
            if ($state.params.b) {
              $location.url($state.params.b);
            }
            replaceState('user.index');
          } else {
            log('Unexpected state. No error and no user.');
          }
        });
      };

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
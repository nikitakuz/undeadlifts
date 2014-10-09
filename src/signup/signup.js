undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('signup',
        {
          url: '/signup',
          templateUrl: 'signup/index.html',
          resolve: {
            simpleLogin: [ 'simpleLogin',
              function(simpleLogin) {
                return simpleLogin.getInitPromise();
              }
            ]
          },
          controller: 'SignupController'
        }
      );
    }
  ]
);

undeadlifts.controller('SignupController',
  [         '$scope', 'state', 'simpleLogin',
    function($scope,   state,   simpleLogin) {
      signupControllerScope = $scope;
      $scope.focusEmail = true;
      $scope.focusPassword = false;
      $scope.emailError = false;
      $scope.passwordError = false;

      var DEFAULT_SIGNUP_BUTTON_TEXT = 'Create my free account';
      $scope.signupButtonText = DEFAULT_SIGNUP_BUTTON_TEXT;

      $scope.signup = function() {
        $scope.signupButtonText = 'Creating account...';
        var email = $scope.email;
        var password = $scope.password;
        simpleLogin.createUser(email, password, function(error, user) {
          if (error) {
            $scope.signupButtonText = 'Create my free account';
            handleAuthError(error);
          } else {
            $scope.$apply(function() {
              $scope.signupButtonText = 'Logging in...';
            });
            simpleLogin.login('password', {
              email: email,
              password: password
            });
          }
        });
      };

      $scope.$on('simpleLogin.login', function(event, error) {
        state.replace('user.index');
      });

      $scope.$watch('form.email.$viewValue', function(newVal, oldVal) {
        if ($scope.emailError && newVal !== oldVal) {
          $scope.emailError = false;
          $scope.signupButtonText = DEFAULT_SIGNUP_BUTTON_TEXT;
        }
      });

      function handleAuthError(error) {
        var msg = {
          'EMAIL_TAKEN': 'This email address is already taken.',
          'INVALID_EMAIL': 'This email address is invalid.'
        };
        if (error.code === 'EMAIL_TAKEN' || error.code === 'INVALID_EMAIL') {
          $scope.emailError = true;
          $scope.focusEmail = true;
        }
        if (error.code === 'EMAIL_TAKEN') {
          $scope.signupButtonText = 'Email address already taken';
        }
        if (error.code === 'INVALID_EMAIL') {
          $scope.signupButtonText = 'Invalid email address';
        }
        $scope.error = msg[error.code] || 'Unrecognized error.';
        $scope.$digest();
      }
    }
  ]
);
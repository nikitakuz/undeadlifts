undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('signup',
        {
          url: '/signup',
          templateUrl: 'signup/index.html',
          controller: 'SignupController'
        }
      );
    }
  ]
);

undeadlifts.controller('SignupController',
  [         '$scope', 'firebase', 'replaceState',
    function($scope,   firebase,   replaceState) {
      $scope.focusEmail = true;
      $scope.focusPassword = false;
      $scope.emailError = false;
      $scope.passwordError = false;

      var DEFAULT_SIGNUP_BUTTON_TEXT = 'Create my free account';
      $scope.signupButtonText = DEFAULT_SIGNUP_BUTTON_TEXT;

      $scope.signup = function() {
        $scope.signupButtonText = 'Creating account...';
        var credentials = {
          email: $scope.email,
          password: $scope.password
        };
        firebase.createUser(credentials, function(error, user) {
          if (error) {
            $scope.signupButtonText = 'Create my free account';
            handleAuthError(error);
          } else {
            $scope.$apply(function() {
              $scope.signupButtonText = 'Logging in...';
            });
            firebase.authWithPassword(credentials, function(error, user) {
              if (error) {
                console.log('Error authenticating');
              } else if (user) {
                replaceState('user.index');
              }
            });
          }
        });
      };

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
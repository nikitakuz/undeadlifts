(function() {
  var signup = angular.module('signup', ['firebase']);
  var signupControllerScope;
  signup.controller('SignUpController',
    [         '$scope',
      function($scope) {
        signupControllerScope = $scope;
        $scope.focusEmail = true;
        $scope.focusPassword = false;
        $scope.emailError = false;
        $scope.passwordError = false;

        $scope.signupButtonText = 'Create my free account';

        $scope.signup = function() {
          $scope.signupButtonText = 'Creating account...';
          var email = $scope.email;
          var password = $scope.password;
          fbsl.createUser(email, password, function(error, user) {
            if (error) {
              $scope.signupButtonText = 'Create my free account';
              handleAuthError(error);
            } else {
              $scope.$apply(function() {
                $scope.signupButtonText = 'Logging in...';
              });
              fbsl.login('password', {
                email: email,
                password: password
              });
            }
          });
        };

        $scope.$watch('form.email.$viewValue', function(newVal, oldVal) {
          if ($scope.emailError && newVal !== oldVal) {
            $scope.emailError = false;
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
          $scope.error = msg[error.code] || 'Unrecognized error.';
          $scope.$digest();
        }
      }
    ]
  );

  signup.directive('focus',
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
      console.log('No user found. Bootstrapping signup module...');
      angular.element(document).ready(function() {
        angular.bootstrap(document, ['signup']);
      });
    }
  });
})();

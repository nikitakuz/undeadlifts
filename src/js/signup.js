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
      console.log('No user found. Bootstrapping signup module...');
      angular.element(document).ready(function() {
        angular.bootstrap(document, ['signup']);
      });
    }
  });

  var signup = angular.module('signup', ['firebase']);
  signup.controller('SignUpController',
    [         '$scope',
      function($scope) {
        $scope.signup = function() {
          var email = $scope.email;
          var password = $scope.password;
          $scope.password = '';
          fbsl.createUser(email, password, function(error, user) {
            if (error) {
              handleAuthError(error);
            } else {
              fbsl.login('password', {
                email: email,
                password: password
              });
            }
          });
        };

        function handleAuthError(error) {
          var msg = {
            'EMAIL_TAKEN': 'This email address is already taken.',
            'INVALID_EMAIL': 'This email address is invalid.'
          };
          $scope.error = msg[error.code] || 'Unrecognized error.';
          $scope.$digest();
        }
      }
    ]
  );
})();

(function() {
  var login = angular.module('undeadlifts.login',
    [
      'ui.router',
      'undeadlifts.user',
      'undeadlifts.templates',
      'undeadlifts.firebase'
    ]
  );

  login.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('login',
          {
            url: '/login?b',
            templateUrl: 'login/login.html',
            controller: 'LoginController',
            resolve: {
              firebase: ['firebase', function(firebase) {
                return firebase.getInitPromise();
              }],
              user: ['$state', 'firebase', function($state, firebase) {
                var auth = firebase.getAuth();
                if (auth && auth.uid) {
                  $state.replace('user.index');
                }
              }]
            }
          }
        );
      }
    ]
  );

  login.controller('LoginController',
    [         '$scope', '$state', '$location', 'firebase', 'user',
      function($scope,   $state,   $location,   firebase,   user) {
        if (sessionStorage.authenticatingWithFacebook) {
          setTimeout(function() {
            delete sessionStorage.authenticatingWithFacebook;
            location.reload();
          }, 1300);
        }
        $scope.focusEmail = false;
        $scope.focusPassword = false;
        $scope.emailError = false;
        $scope.passwordError = false;
        $scope.logInButtonText = 'Log in';

        $scope.logIn = function() {
          $scope.logInButtonText = 'Logging in...';
          var credentials = { email: $scope.email, password: $scope.password };
          firebase.authWithPassword(credentials, onLoginComplete);
        };

        $scope.logInWithFacebook = function() {
          sessionStorage.authenticatingWithFacebook = true;
          firebase.authWithFacebook(onLoginComplete);
        };

        function onLoginComplete(error, user) {
          if (error) {
            $scope.handleError(error);
          } else if (user) {
            redirect();
          } else {
            log('Unexpected state. No error and no user.');
          }
        }

        function redirect() {
          if ($state.params.b) {
            $scope.$apply(function() {
              $location.url($state.params.b);
            });
          } else {
            $state.replace('user.index');
          }
        }

        $scope.handleError = function(error) {
          $scope.logInButtonText = 'Login to my account';
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
})();
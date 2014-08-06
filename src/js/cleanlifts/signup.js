cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider.state('signup',
        {
          url: '/signup?b',
          templateUrl: 'partials/signup.html',
          controller: 'signUpController'
        }
      );
    }
  ]
);

cleanlifts.controller('signUpController',
  [         '$scope', 'auth',
    function($scope,   auth) {
      $scope.auth = auth;
    }
  ]
);


cleanlifts.controller('CreateUser',
  [         '$scope', '$stateParams', 'logger', 'auth',
    function($scope,   $stateParams,   logger,   auth) {
      $scope.createUser = function(email, password) {
        auth.createUser(email, password, function(error, user) {
          if (error) {
            handleAuthError(error);
          } else {
            auth.login('password', {
              email: email,
              password: password
            });
            $scope.$state.transitionTo($scope.$stateParams.b || 'index');
          }
        });
      };

      function handleAuthError(error) {
        if (error.code === 'EMAIL_TAKEN') {
          $scope.$apply(function() {
            $scope.error = "This email address is already taken.";
          });
        }
      }
    }
  ]
);


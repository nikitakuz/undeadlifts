cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.choose-workout',
        {
          url: '/choose-workout',
          templateUrl: 'partials/choose-workout.html',
          controller: 'ChooseWorkoutController',
          resolve: {
            auth: ['auth', function(auth) { return auth; }]
          }
        }
      );
    }
  ]
);

cleanlifts.controller('ChooseWorkoutController',
  [         '$scope', 'firebase',
    function($scope,   firebase) {
      var workout = firebase.child('workout');
    }
  ]
);
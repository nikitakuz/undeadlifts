cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.select-routine',
        {
          url: '/select-routine',
          templateUrl: 'partials/select-routine.html',
          controller: 'SelectRoutineController'
        }
      );
    }
  ]
);

cleanlifts.controller('SelectRoutineController',
  [         '$scope', 'log', 'firebase',
    function($scope,   log,   firebase) {
      log('Loading routines...');
      var workout = firebase.child('workout');
      $scope.routines = [
        '1', '2', '3'
      ];
    }
  ]
);
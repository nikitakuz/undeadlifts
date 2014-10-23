(function() {
  var routines = angular.module('undeadlifts.user.routines',
    [
      'ui.router',
      'undeadlifts.user.routines.create'
    ]
  );

  routines.config(
    [         '$stateProvider',
      function ($stateProvider) {
        $stateProvider.state('user.routines',
          {
            url: '/routines',
            templateUrl: 'user/routines/routines.html',
            controller: 'RoutinesController',
            resolve: {
              routines: ['auth', 'firebase', function(auth, firebase) {
                return firebase.sync(['users', auth.uid, 'routines']).$asArray().$loaded();
              }]
            }
          }
        );
      }
    ]
  );

  routines.controller('RoutinesController',
    [         '$state', '$scope', 'routines',
      function($state,   $scope,   routines) {
        $scope.routines = routines;

      }
    ]
  );
})();
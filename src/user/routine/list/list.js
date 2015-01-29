(function() {
  var routines = angular.module('undeadlifts.user.routine.list',
    [
      'ui.router',
      'undeadlifts.user.routine.create'
    ]
  );

  routines.config(
    [         '$stateProvider',
      function ($stateProvider) {
        $stateProvider.state('user.routine.list',
          {
            title: 'Routines',
            url: '/routines',
            templateUrl: 'user/routine/list/list.html',
            controller: 'RoutineListController',
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

  routines.controller('RoutineListController',
    [         '$state', '$scope', 'routines',
      function($state,   $scope,   routines) {
        $scope.routines = routines;

      }
    ]
  );
})();
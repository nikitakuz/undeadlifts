(function() {
  var routine = angular.module('undeadlifts.user.routine',
    [
      'ui.router',
      'undeadlifts.user.routine.list',
      'undeadlifts.user.routine.create',
      'undeadlifts.user.routine.edit'
    ]
  );

  routine.config(
    [         '$stateProvider',
      function ($stateProvider) {
        $stateProvider.state('user.routine',
          {
            abstract: true,
            url: '/routine',
            template: '<ui-view/>',
            controller: 'AbstractRoutineController'
          }
        );
      }
    ]
  );

  routine.controller('AbstractRoutineController',
    [         '$state', '$scope',
      function($state,   $scope) {
        // DO NOTHING, JUST EXIST
      }
    ]
  );
})();

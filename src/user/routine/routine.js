(function() {
  var routine = angular.module('undeadlifts.user.routine',
    [
      'ui.router',
      'undeadlifts.user.routine.list',
      'undeadlifts.user.routine.create',
      'undeadlifts.user.routine.edit',
      'undeadlifts.user.routine.select'
    ]
  );

  routine.config(
    [         '$stateProvider',
      function ($stateProvider) {
        $stateProvider.state('user.routine',
          {
            abstract: true,
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
        $scope.addLift = function(routine) {
          var lift = { name: 'New Lift', sets: 3, reps: 7, isNew: true };
          routine.lifts.push(lift);
          setTimeout(function() {
            delete lift.isNew;
          }, 1);
        };
        // DO NOTHING, JUST EXIST
      }
    ]
  );
})();

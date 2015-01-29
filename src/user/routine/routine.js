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
    [         '$state', '$scope', 'LIFTS',
      function($state,   $scope,   LIFTS) {
        $scope.LIFTS = [
          { name: 'Squats' },
          { name: 'Bench Press' },
          { name: 'Barbell Row' },
          { name: 'Push-ups' },
          { name: 'Pull-ups' }
        ];

        $scope.lifts = LIFTS;

        $scope.addLift = function(routine) {
          var lift = { name: 'New Lift', sets: 3, reps: 7, isNew: { really: { really: { really: true } } } };
          routine.lifts.push(lift);
          setTimeout(function() {
            delete lift.isNew;
          }, 1);
        };

        $scope.validateRoutine = function(routine) {
          var valid = true;
          var errors = { lifts: new Array(routine.lifts.length) };
          for (var i = 0; i < routine.lifts.length; i++) {
            if (routine.lifts[i].name.length < 1) {
              valid = false;
              errors.lifts[i] = true;
            } else {
              errors.lifts[i] = false;
            }
          }
          return {
            valid: valid,
            errors: errors
          };
        }
      }
    ]
  );
})();

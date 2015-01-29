(function() {
  var create = angular.module('undeadlifts.user.routine.create',
    [
      'ui.router',
      'undeadlifts.state-decorator',
      'undeadlifts.lifts-constant',
      'undeadlifts.util',
    ]
  );

  create.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.routine.create',
          {
            title: 'Create Routine',
            url: '/create-routine',
            templateUrl: 'user/routine/routine.html',
            controller: 'CreateRoutineController'
          }
        );
      }
    ]
  );

  create.controller('CreateRoutineController',
    [         '$window', '$state', '$scope', 'user',
      function($window,   $state,   $scope,   user) {
        $scope.routine = {
          name: '',
          lifts: []
        };

        $scope.nav.menuItems = [ {
          text: 'Discard Routine',
          callback: function() {
            if ($scope.routine.name.length === 0 && $scope.routine.lifts.length === 0) {
              $state.transitionTo('user.routine.list', {}, {});
            } else {
              $scope.confirm({
                message:
                  '<div>Are you sure you want to discard this routine?</div>',
                cancelText: 'Cancel',
                confirmText: 'Discard',
                confirmCallback: function() {
                  $state.transitionTo('user.routine.list', {}, {});
                }
              });
            }
          }
        } ];

        $scope.MIN_SETS = 1;
        $scope.MAX_SETS = 5;
        $scope.MIN_REPS = 1;
        $scope.MAX_REPS = 25;

        $scope.type = false;
        $scope.search = '';

        $scope.setType = function(type) {
          $scope.type = type;
        };

/*
        $scope.selected = [
          { "name": "Cable Crunches",  "type": "cable",    "sets": 5,  "reps": 5 },
          { "name": "Barbell Press",   "type": "Barbell",  "sets": 5,  "reps": 5 },
          { "name": "Power Clean",     "type": "Barbell",  "sets": 5,  "reps": 5 }
        ];
*/

        $scope.selected = $scope.selected || [];

        $scope.showMoveControls = false;

        $scope.editLifts = function() {
          $scope.showMoveControls = true;
        };

        $scope.removeLift = function(lift) {
          var index = $scope.routine.lifts.indexOf(lift);
          $scope.routine.lifts.splice(index, 1);
        };

        $scope.createRoutine = function() {
          var routine = $scope.routine;
          if (!routine.name || routine.lifts.length < 1) {
            return;
          }
          user.routines = user.routines || [];
          var routines = user.routines;
          for (var i = 0; i < routines.length; i++) {
            if (routines[i].name === $scope.routine.name) {
              $scope.alert('A routine with this name already exists.');
              return;
            }
          }

          routines.push(routine);
          user.$save();
          $state.replace('user.routine.select');
        };
      }
    ]
  );
})();

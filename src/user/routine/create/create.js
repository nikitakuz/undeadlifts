(function() {
  var create = angular.module('undeadlifts.user.routine.create',
    [
      'ui.router',
      'undeadlifts.state-decorator',
      'undeadlifts.lifts-constant',
      'undeadlifts.util',
      'undeadlifts.user.routine.create.add-lift'
    ]
  );

  create.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.routine.create',
          {
            url: '/create-routine',
            templateUrl: 'user/routine/routine.html',
            controller: 'CreateRoutineController'
          }
        );
      }
    ]
  );

  create.controller('CreateRoutineController',
    [         '$window', '$state', '$scope', 'user', 'LIFTS',
      function($window,   $state,   $scope,   user,   LIFTS) {
        $scope.MIN_SETS = 1;
        $scope.MAX_SETS = 5;
        $scope.MIN_REPS = 1;
        $scope.MAX_REPS = 25;

        $scope.types = [
          LIFTS.BARBELL,
          LIFTS.DUMBBELL,
          LIFTS.BODYWEIGHT,
          LIFTS.CABLE
        ];

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

        $scope.routine = {
          name: '',
          lifts: []
        };

/*
        $scope.addLift = function(lift) {
          if (lift.name === 'Squat Rack Curls') {
            $scope.alert('Curls are not allowed in the squat rack.');
            return;
          }
          if ($scope.selected.indexOf(lift) === -1) {
            lift.type = LIFTS.getTypeName(lift);
            $scope.selected.push(lift);
            $scope.type = false;
          }
          if ($window.history && $window.history.back) {
            $window.history.back();
          } else {
            $state.replace('user.routine.create');
          }
        };
*/

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

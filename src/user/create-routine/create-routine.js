(function() {
  var createRoutine = angular.module('undeadlifts.user.create-routine',
    [
      'ui.router',
      'undeadlifts.decorators',
      'undeadlifts.util',
      'undeadlifts.user.create-routine.add-lift'
    ]
  );

  createRoutine.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.create-routine',
          {
            abstract: true,
            url: '/create-routine',
            template: '<div><ui-view class="create-routine"/></div>',
            controller: 'AbstractCreateRoutineController'
          }
        );

        $stateProvider.state('user.create-routine.index',
          {
            url: '',
            templateUrl: 'user/create-routine/create-routine.html',
            controller: 'CreateRoutineController'
          }
        );
      }
    ]
  );

  createRoutine.controller('AbstractCreateRoutineController',
    [         '$window', '$state', '$scope', 'liftService', 'user',
      function($window,   $state,   $scope,   liftService,   user) {
        $scope.MIN_SETS = 1;
        $scope.MAX_SETS = 5;
        $scope.MIN_REPS = 1;
        $scope.MAX_REPS = 25;


        $scope.types = liftService.TYPES;

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

        $scope.lifts = liftService.ORDERED;

        $scope.routine = {
          name: ''
        };

        $scope.addLift = function(lift) {
          if (lift.name === 'Squat Rack Curls') {
            $scope.alert('Curls are not allowed in the squat rack.');
            return;
          }
          if ($scope.selected.indexOf(lift) === -1) {
            lift.type = $scope.type.name;
            $scope.selected.push(lift);
          }
          if ($window.history && $window.history.back) {
            $window.history.back();
          } else {
            $state.replace('user.create-routine.index');
          }
        };

        $scope.editLifts = function() {
          $scope.showMoveControls = true;
        };

        $scope.removeLift = function(lift) {
          var index = $scope.selected.indexOf(lift);
          $scope.selected.splice(index, 1);
        };

        $scope.createRoutine = function() {
          var routine = $scope.routine;
          var selected = $scope.selected;
          if (!routine.name || selected.length < 1) {
            return;
          }
          user.routines = user.routines || [];
          var routines = user.routines;
          for (var i = 0; i < routines.length; i++) {
            debugger;
            if (routines[i].name === $scope.routine.name) {
              $scope.alert('A routine with the this name already exists.');
              return;
            }
          }

          routine.lifts = JSON.parse(JSON.stringify($scope.selected));

          for (var j = 0; j < routine.lifts.length; j++) {
            var lift = routine.lifts[j];
            var sets = [];
            for (var k = 0; k < lift.sets; k++) {
              sets.push({ target: lift.reps });
            }
            routine.lifts[j] = {
              name: lift.name,
              sets: sets
            };
          }
          routines.push(routine);
          user.$save();
          $state.replace('user.select-routine');
        };
      }
    ]
  );

  createRoutine.controller('CreateRoutineController',
    [
      function() {}
    ]
  );
})();

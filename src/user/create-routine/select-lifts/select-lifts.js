undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.create-routine.select-lifts',
        {
          url: '',
          templateUrl: 'user/create-routine/select-lifts/select-lifts.html',
          controller: 'SelectLiftsController'
        }
      );
    }
  ]
);

undeadlifts.controller('SelectLiftsController',
  [         '$window', '$scope',
    function($window,   $scope) {
      var BARBELL = 0;
      var DUMBELL = 1;
      var CABLE = 2;
      var OTHER = 3;

      $scope.types = [
        { name: 'All Lifts', type: -1 },
        { name: 'Barbell Lifts', type: BARBELL },
        { name: 'Dumbell Lifts', type: DUMBELL },
        { name: 'Cable Lifts', type: CABLE },
        { name: 'Other', type: OTHER }
      ];
      $scope.type = $scope.types[0];

      $scope.lifts = [
        { name: 'Squat',              type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Arnold Press',       type: DUMBELL,  sets: 5, reps: 5 },
        { name: 'Barbell Bench',      type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Barbell Curl',       type: BARBELL,  sets: 3, reps: 8 },
        { name: 'Barbell Press',      type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Barbell Row',        type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Barbell Shrug',      type: BARBELL,  sets: 3, reps: 8 },
        { name: 'Cable Crunches',     type: CABLE,    sets: 5, reps: 5 },
        { name: 'Cable Row',          type: CABLE,    sets: 5, reps: 5 },
        { name: 'Chin Up',            type: OTHER,    sets: 5, reps: 5 },
        { name: 'Deadlift',           type: BARBELL,  sets: 1, reps: 5 },
        { name: 'Dips',               type: OTHER,    sets: 5, reps: 5 },
        { name: 'Dumbell Bench',      type: DUMBELL,  sets: 5, reps: 5 },
        { name: 'Dumbell Curl',       type: DUMBELL,  sets: 5, reps: 5 },
        { name: 'Dumbell Press',      type: DUMBELL,  sets: 5, reps: 5 },
        { name: 'Dumbell Row',        type: DUMBELL,  sets: 5, reps: 5 },
        { name: 'Dumbell Shrug',      type: DUMBELL,  sets: 5, reps: 5 },
        { name: 'Goblet Squat',       type: DUMBELL,  sets: 5, reps: 5 },
        { name: 'Hyperextensions',    type: OTHER,    sets: 2, reps: 10 },
        { name: 'Pistol Squats',      type: OTHER,    sets: 5, reps: 5 },
        { name: 'Power Clean',        type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Push Up',            type: OTHER,    sets: 3, reps: 10 },
        { name: 'Pull Over',          type: OTHER,    sets: 3, reps: 10 },
        { name: 'Pull Up',            type: OTHER,    sets: 3, reps: 10 },
        { name: 'Reverse Crunches',   type: OTHER,    sets: 3, reps: 10 },
        { name: 'Tricep Extensions',  type: CABLE,    sets: 5, reps: 5 }
      ];

      $scope.selectLift = function(lift) {
        if ($scope.selected.indexOf(lift) > -1) {
          $scope.deselectLift(lift);
          return;
        }
        $scope.selected.push(lift);
      };

      $scope.deselectLift = function(lift) {
        var index = $scope.selected.indexOf(lift);
        $scope.selected.splice(index, 1);
      };

      $scope.clearSelected = function() {
        $scope.selected = [];
      };

      $scope.isLiftSelectedFilter = function() {
        return function(lift) {
          return $scope.selected.indexOf(lift) === -1
        }
      };

      $scope.isLiftTypeFilter = function(type) {
        return function(lift) {
          return type.type < 0 || type.type === lift.type;
        }
      };

      console.log('setting position interval');
      var nav = document.getElementById('nav');
      $scope.windowScrollY = 0;
      var positionInterval = setInterval(function() {
        var y = Math.max($window.scrollY - nav.offsetHeight, 0);
        if ($scope.windowScrollY !== y) {
          $scope.$apply(function() {
            $scope.windowScrollY = Math.max($window.scrollY - nav.offsetHeight, 0);
          });
        }
      }, 100);

      $scope.$on('$destroy', function() {
        console.log('clearing position interval');
        clearInterval(positionInterval);
      });
    }
  ]
);
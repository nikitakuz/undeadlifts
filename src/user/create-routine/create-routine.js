undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.create-routine',
        {
          abstract: true,
          url: '/create-routine',
          template: '<div><ui-view class="create-routine"/></div>',
          controller: 'CreateRoutineController'
        }
      );
    }
  ]
);
undeadlifts.service('lifts', [
  function() {
    var BARBELL = 0;
    var DUMBELL = 1;
    var CABLE = 2;
    var OTHER = 3;

    return {
      BARBELL: BARBELL,
      DUMBELL: DUMBELL,
      CABLE: CABLE,
      OTHER: OTHER,
      ORDERED: [
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
      ]
    }
  }
]);
undeadlifts.controller('CreateRoutineController',
  [         '$scope', 'lifts',
    function($scope, lifts) {
      $scope.selected = [];

      $scope.lifts = lifts.ORDERED;
    }
  ]
);
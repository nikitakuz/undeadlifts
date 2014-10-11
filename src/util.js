(function() {
  var util = angular.module('undeadlifts.util', []);

  util.service('util',
    [
      function() {
        return {
          arrayFilledWithValues: function(length, value) {
            var a = Array.apply(null, Array(parseInt(length)));
            return a.map(function() { return value; });
          },
          parseYyyyMmDd: function(yyyyMmDd) {
            var yyyy = yyyyMmDd.substr(0, 4);
            var mm = yyyyMmDd.substr(4, 2);
            var dd = yyyyMmDd.substr(6, 2);
            return new Date(yyyy, mm - 1, dd);
          }
        };
      }
    ]
  );

  util.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if(reverse) filtered.reverse();
      return filtered;
    };
  });

  util.service('replaceState',
    [         '$state',
      function($state) {
        return function(state, params) {
          $state.transitionTo(state, params || {}, {location: 'replace'});
        };
      }
    ]
  );

  util.service('liftService', [
    function() {
      var BARBELL = 0;
      var DUMBELL = 1;
      var CABLE = 2;
      var OTHER = 3;

      var ORDERED = [
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

      return {
        BARBELL: BARBELL,
        DUMBELL: DUMBELL,
        CABLE: CABLE,
        OTHER: OTHER,
        ORDERED: ORDERED,
        getType: function(name) {
          for (var i = 0; i < ORDERED.length; i++) {
            var lift = ORDERED[i];
            if (lift.name === name) {
              return lift.type;
            }
          }
        },

        getStartingWeight: function(name) {
          var type = this.getType(name);
          if (type === BARBELL) {
            return 45;
          } else if (type === DUMBELL) {
            return 5;
          } else if (type === CABLE) {
            return 10;
          } else {
            return 0;
          }
        }
      };
    }
  ]);
})();

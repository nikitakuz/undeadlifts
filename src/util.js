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
      var DUMBBELL = 1;
      var CABLE = 2;
      var OTHER = 3;
      var NOPE = 4;

      var ORDERED = [
        { name: 'Squat',                    type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Arnold Press',             type: DUMBBELL, sets: 5, reps: 5 },
        { name: 'Barbell Bench',            type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Barbell Curl',             type: BARBELL,  sets: 3, reps: 8 },
        { name: 'Bench Press',              type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Barbell Row',              type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Barbell Shrug',            type: BARBELL,  sets: 3, reps: 8 },
        { name: 'Cable Crunches',           type: CABLE,    sets: 3, reps: 10 },
        { name: 'Cable Row',                type: CABLE,    sets: 5, reps: 5 },
        { name: 'Chin Up',                  type: OTHER,    sets: 5, reps: 5 },
        { name: 'Close-Grip Bench Press',   type: BARBELL,  sets: 3, reps: 8 },
        { name: 'Close-Grip DB Press',      type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'Deadlift',                 type: BARBELL,  sets: 1, reps: 5 },
        { name: 'Decline Press',            type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Dips',                     type: OTHER,    sets: 3, reps: 10 },
        { name: 'DB Bench',                 type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Curl',                  type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Decline Press',         type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Decline Fly',           type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Fly',                   type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Incline Press',         type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Incline Fly',           type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Press',                 type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Reverse Fly',           type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Reverse Wrist Curls',   type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Row',                   type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Shrug',                 type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'DB Wrist Curls',           type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'Goblet Squat',             type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'Hyperextensions',          type: OTHER,    sets: 2, reps: 10 },
        { name: 'Incline Press',            type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Power Clean',              type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Lateral Raises',           type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'Overhead Press',           type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Pistol Squats',            type: OTHER,    sets: 5, reps: 5 },
        { name: 'Power Clean',              type: BARBELL,  sets: 5, reps: 5 },
        { name: 'Push Up',                  type: OTHER,    sets: 3, reps: 10 },
        { name: 'Pull Over',                type: OTHER,    sets: 3, reps: 10 },
        { name: 'Pull Up',                  type: OTHER,    sets: 3, reps: 10 },
        { name: 'Reverse Crunches',         type: OTHER,    sets: 3, reps: 10 },
        { name: 'Reverse Wrist Curls',      type: BARBELL,  sets: 3, reps: 10 },
        { name: 'Squat Rack Curls',         type: NOPE,     sets: 0, reps: 0 }, // Happy Easter
        { name: 'Tricep Extensions',        type: DUMBBELL, sets: 3, reps: 8 },
        { name: 'Tricep Pulldowns',         type: CABLE,    sets: 3, reps: 8 },
        { name: 'Wrist Curls',              type: BARBELL,  sets: 3, reps: 10 },
      ];

      return {
        BARBELL: BARBELL,
        DUMBELL: DUMBBELL,
        CABLE: CABLE,
        OTHER: OTHER,
        NOPE: NOPE,
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
          } else if (type === DUMBBELL) {
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

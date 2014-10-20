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

      var BARBELL = [
        { name: 'Squat',                  sets: 5, reps: 5 },
        { name: 'Barbell Curl',           sets: 5, reps: 5 },
        { name: 'Bench Press',            sets: 5, reps: 5 },
        { name: 'Barbell Row',            sets: 5, reps: 5 },
        { name: 'Barbell Shrug',          sets: 3, reps: 5 },
        { name: 'Close-Grip Bench Press', sets: 3, reps: 5 },
        { name: 'Deadlift',               sets: 1, reps: 5 },
        { name: 'Decline Press',          sets: 5, reps: 5 },
        { name: 'Incline Press',          sets: 5, reps: 5 },
        { name: 'Overhead Press',         sets: 5, reps: 5 },
        { name: 'Power Clean',            sets: 5, reps: 5 },
        { name: 'Reverse Wrist Curls',    sets: 5, reps: 5 },
        { name: 'Squat Rack Curls',       sets: 0, reps: 0 }, // Happy Easter
        { name: 'Wrist Curls',            sets: 5, reps: 5 }
      ];

      var BODYWEIGHT = [
        { name: 'Chin Up',                sets: 5, reps: 5 },
        { name: 'Dips',                   sets: 3, reps: 10 },
        { name: 'Pistol Squats',          sets: 5, reps: 5 },
        { name: 'Hyperextensions',        sets: 2, reps: 10 },
        { name: 'Push Up',                sets: 3, reps: 10 },
        { name: 'Pull Over',              sets: 3, reps: 10 },
        { name: 'Pull Up',                sets: 3, reps: 10 },
        { name: 'Reverse Crunches',       sets: 3, reps: 10 }
      ];

      var DUMBBELL = [
        { name: 'Arnold Press',             sets: 5, reps: 5 },
        { name: 'Close-Grip Bench Press',   sets: 3, reps: 8 },
        { name: 'Decline Press',            sets: 3, reps: 8 },
        { name: 'Decline Fly',              sets: 3, reps: 8 },
        { name: 'Dumbbell Bench Press',     sets: 3, reps: 8 },
        { name: 'Dumbbell Curl',            sets: 3, reps: 8 },
        { name: 'Dumbbell Fly',             sets: 3, reps: 8 },
        { name: 'Dumbbell Row',             sets: 3, reps: 8 },
        { name: 'Dumbbell Shoulder Press',  sets: 3, reps: 8 },
        { name: 'Dumbbell Shrug',           sets: 3, reps: 8 },
        { name: 'Incline Press',            sets: 3, reps: 8 },
        { name: 'Incline Fly',              sets: 3, reps: 8 },
        { name: 'Reverse Fly',              sets: 3, reps: 8 },
        { name: 'Reverse Wrist Curls',      sets: 3, reps: 8 },
        { name: 'Wrist Curls',              sets: 3, reps: 8 },
        { name: 'Goblet Squat',             sets: 3, reps: 8 },
        { name: 'Lateral Raises',           sets: 3, reps: 8 },
        { name: 'Tricep Extensions',        sets: 3, reps: 8 }
      ];

      var CABLE = [
        { name: 'Cable Crunches',         sets: 3, reps: 10 },
        { name: 'Cable Row',              sets: 5, reps: 5 },
        { name: 'Tricep Pulldowns',       sets: 3, reps: 8 }
      ];

      for (var i = 0; i < BARBELL.length; i++) {
        for (var j = 0; j < DUMBBELL.length; j++) {
          if (BARBELL[i].name === DUMBBELL[j].name) {
            BARBELL[i].ambigiousName = true;
            DUMBBELL[j].ambigiousName = true;
          }
        }
      }

      return {
        TYPES: [
          { name: 'Barbell', lifts: BARBELL },
          { name: 'Dumbbell', lifts: DUMBBELL },
          { name: 'Bodyweight', lifts: BODYWEIGHT} ,
          { name: 'Cable', lifts: CABLE }
        ],
        BARBELL: BARBELL,
        DUMBBELL: DUMBBELL,
        BODYWEIGHT: BODYWEIGHT,
        CABLE: CABLE,

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

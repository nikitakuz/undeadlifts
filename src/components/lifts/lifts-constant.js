(function() {
  var liftsConstant = angular.module('undeadlifts.lifts-constant', []);

  var BARBELL = 'BB';
  var DUMBBELL = 'DB';
  var CABLE = 'CB';
  var BODYWEIGHT = 'BW';

  var LIFTS = [

    // BARBELL

    { type: BARBELL, name: 'Squat',                        sets: 5, reps: 5 },
    { type: BARBELL, name: 'Barbell Curl',                 sets: 5, reps: 5 },
    { type: BARBELL, name: 'Bench Press',                  sets: 5, reps: 5 },
    { type: BARBELL, name: 'Barbell Row',                  sets: 5, reps: 5 },
    { type: BARBELL, name: 'Barbell Shrug',                sets: 3, reps: 5 },
    { type: BARBELL, name: 'Close-Grip Bench Press',       sets: 3, reps: 5 },
    { type: BARBELL, name: 'Deadlift',                     sets: 1, reps: 5 },
    { type: BARBELL, name: 'Decline Press',                sets: 5, reps: 5 },
    { type: BARBELL, name: 'Hang Clean',                   sets: 5, reps: 5 },
    { type: BARBELL, name: 'Hang Clean and Press',         sets: 5, reps: 5 },
    { type: BARBELL, name: 'Incline Press',                sets: 5, reps: 5 },
    { type: BARBELL, name: 'Overhead Press',               sets: 5, reps: 5 },
    { type: BARBELL, name: 'Power Clean',                  sets: 5, reps: 5 },
    { type: BARBELL, name: 'Power Clean and Press',        sets: 5, reps: 5 },
    { type: BARBELL, name: 'Push Press',                   sets: 5, reps: 5 },
    { type: BARBELL, name: 'Reverse Barbell Wrist Curls',  sets: 5, reps: 5 },
    { type: BARBELL, name: 'Reverse Barbell Curl',         sets: 5, reps: 5 },
    { type: BARBELL, name: 'Split Clean',                  sets: 5, reps: 5 },
    { type: BARBELL, name: 'Squat Clean',                  sets: 5, reps: 5 },
    { type: BARBELL, name: 'Squat Rack Curls',             sets: 0, reps: 0 }, // Happy Easter
    { type: BARBELL, name: 'Barbell Wrist Curls',          sets: 5, reps: 5 },

    // BODYWEIGHT

    { type: BODYWEIGHT, name: 'Chin Up',                sets: 5, reps: 5 },
    { type: BODYWEIGHT, name: 'Dips',                   sets: 3, reps: 10 },
    { type: BODYWEIGHT, name: 'Pistol Squat',           sets: 5, reps: 5 },
    { type: BODYWEIGHT, name: 'Hyperextensions',        sets: 2, reps: 10 },
    { type: BODYWEIGHT, name: 'Push Up',                sets: 3, reps: 10 },
    { type: BODYWEIGHT, name: 'Pull Over',              sets: 3, reps: 10 },
    { type: BODYWEIGHT, name: 'Pull Up',                sets: 3, reps: 10 },
    { type: BODYWEIGHT, name: 'Reverse Crunches',       sets: 3, reps: 10 },

    // DUMBBELL

    { type: DUMBBELL, name: 'Arnold Press',                 sets: 5, reps: 5 },
    { type: DUMBBELL, name: 'Close-Grip Dumbbell Press',    sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Decline Dumbbell Press',       sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Decline Fly',                  sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Dumbbell Bench Press',         sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Dumbbell Curl',                sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Dumbbell Fly',                 sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Dumbbell Row',                 sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Dumbbell Shoulder Press',      sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Dumbbell Shrug',               sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Incline Dumbbell Press',       sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Incline Fly',                  sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Reverse Fly',                  sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Dumbbell Reverse Wrist Curls', sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Dumbbell Wrist Curls',         sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Goblet Squat',                 sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Lateral Raises',               sets: 3, reps: 8 },
    { type: DUMBBELL, name: 'Tricep Extensions',            sets: 3, reps: 8 },

    // CABLE

    { type: CABLE, name: 'Cable Crunches',         sets: 3, reps: 8 },
    { type: CABLE, name: 'Cable Curls',            sets: 3, reps: 8 },
    { type: CABLE, name: 'Cable Row',              sets: 5, reps: 5 },
    { type: CABLE, name: 'Reverse Cable Curls',    sets: 3, reps: 8 },
    { type: CABLE, name: 'Tricep Pulldowns',       sets: 3, reps: 8 }
  ];

  liftsConstant.constant('LIFTS',
    {
      TYPES: {
        BARBELL: BARBELL,
        DUMBBELL: DUMBBELL,
        BODYWEIGHT: BODYWEIGHT,
        CABLE: CABLE
      },
      getTypeName: function(lift) {
        var types = [this.BARBELL, this.DUMBBELL, this.BODYWEIGHT, this.CABLE];
        for (var i = 0; i < types.length; i++) {
          var TYPE = types[i];
          var LIFTS = TYPE.LIFTS;
          if (LIFTS.indexOf(lift) > -1) {
            return TYPE.NAME;
          }
        }
      }
    }
  );
})();
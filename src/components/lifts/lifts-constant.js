(function() {
  var liftsConstant = angular.module('undeadlifts.lifts-constant', []);

  var BARBELL_LIFTS = [
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

  var BODYWEIGHT_LIFTS = [
    { name: 'Chin Up',                sets: 5, reps: 5 },
    { name: 'Dips',                   sets: 3, reps: 10 },
    { name: 'Pistol Squats',          sets: 5, reps: 5 },
    { name: 'Hyperextensions',        sets: 2, reps: 10 },
    { name: 'Push Up',                sets: 3, reps: 10 },
    { name: 'Pull Over',              sets: 3, reps: 10 },
    { name: 'Pull Up',                sets: 3, reps: 10 },
    { name: 'Reverse Crunches',       sets: 3, reps: 10 }
  ];

  var DUMBBELL_LIFTS = [
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

  var CABLE_LIFTS = [
    { name: 'Cable Crunches',         sets: 3, reps: 10 },
    { name: 'Cable Row',              sets: 5, reps: 5 },
    { name: 'Tricep Pulldowns',       sets: 3, reps: 8 }
  ];

  liftsConstant.constant('LIFTS',
    {
      BARBELL: {
        NAME: 'Barbell', LIFTS: BARBELL_LIFTS, STARTING_WEIGHT: 45
      },
      DUMBBELL: {
        NAME: 'Dumbbell', LIFTS: DUMBBELL_LIFTS, STARTING_WEIGHT: 5
      },
      BODYWEIGHT: {
        NAME: 'Bodyweight', LIFTS: BODYWEIGHT_LIFTS, STARTING_WEIGHT: 0
      },
      CABLE: {
        NAME: 'Cable', LIFTS: CABLE_LIFTS, STARTING_WEIGHT: 10
      }
    }
  );
})();
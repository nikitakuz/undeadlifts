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
    [
      "Arnold Press",
      "Barbell Curl",
      "Barbell Row",
      "Barbell Shrug",
      "Barbell Wrist Curls",
      "Bench Press",
      "Cable Crunches",
      "Cable Curls",
      "Cable Row",
      "Chin Up",
      "Close-Grip Bench Press",
      "Close-Grip Dumbbell Press",
      "Deadlift",
      "Decline Dumbbell Press",
      "Decline Fly",
      "Decline Press",
      "Dips",
      "Dumbbell Bench Press",
      "Dumbbell Curl",
      "Dumbbell Fly",
      "Dumbbell Reverse Wrist Curls",
      "Dumbbell Row",
      "Dumbbell Shoulder Press",
      "Dumbbell Shrug",
      "Dumbbell Wrist Curls",
      "Face Pulls",
      "Goblet Squat", "Hang Clean",
      "Hang Clean and Press",
      "Hyperextensions",
      "Incline Dumbbell Press",
      "Incline Fly",
      "Incline Press",
      "Lateral Raises",
      "Overhead Press",
      "Pistol Squat",
      "Power Clean",
      "Power Clean and Press",
      "Pull Over",
      "Pull Up",
      "Push Press",
      "Push Up",
      "Reverse Barbell Curl",
      "Reverse Barbell Wrist Curls",
      "Reverse Cable Curls",
      "Reverse Crunches",
      "Reverse Fly",
      "Split Clean",
      "Squat",
      "Squat Clean",
      "Squat Rack Curls",
      "Tricep Extensions",
      "Tricep Pulldowns"
    ]
  );
})();
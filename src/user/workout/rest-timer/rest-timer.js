(function() {
  var restTimer = angular.module('undeadlifts.user.workout.rest-timer', []);

  restTimer.controller('RestTimerController',
    [         '$rootScope', '$scope',
      function($rootScope,   $scope) {
        var restTimerTimeout = null;
        var restTimerInterval = null;
        var timerSound = new Howl({ urls: ['lib/mp3/chirp-chirp.mp3'] });
        $scope.showRestTimer = false;
        $scope.restTime = 0;

        function getRestMessage1(reps, completed) {
          return reps === completed ? 'Congrats getting ' + reps + ' reps!' : 'Failing is part of the game!';
        }

        function getRestMessage2(reps, completed) {
          return reps === completed ?
            'If it was easy, rest 90 sec. If not, 3 min.' :
            'Rest 5 mins and you\'ll get your next set.';
        }

        $rootScope.restTimer = {
          start: function(target, completed) {
            this.clear();
            restTimerTimeout = setTimeout(function() {
              $scope.$apply(function() {
                $scope.showRestTimer = true;
                $scope.rest_message_1 = getRestMessage1(target, completed);
                $scope.rest_message_2 = getRestMessage2(target, completed);
              });
              restTimerInterval = setInterval(function() {
                $scope.$apply(function() {
                  $scope.restTime += 1000;
                  if ($scope.user.settings['rest-timer-sound'] && ($scope.restTime === 90 * 1000 || $scope.restTime === 180 * 1000)) {
                    timerSound.play();
                  }
                });
              }, 1000);
            }, 1500);
          },

          clear: function() {
            clearTimeout(restTimerTimeout);
            clearInterval(restTimerInterval);
            $scope.showRestTimer = false;
            $scope.restTime = 0;
          }
        };
      }
    ]
  );
})();


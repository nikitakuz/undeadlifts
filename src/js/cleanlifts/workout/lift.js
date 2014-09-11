cleanlifts.controller('LiftController',
  [         '$rootScope', '$scope', '$state',
    function($rootScope,   $scope,   $state) {
      $scope.classname = { 1: 'one-set', 2: 'two-sets', 3: 'three-sets', 4: 'four-sets', 5: 'five-sets' }[$scope.lift.sets.length];
      $scope.success = false;
      $scope.failure = false;
      $scope.successMessage = 'Congrats on getting all your sets. ';
      $scope.failureMessage = 'Failure is part of the game. ';
      var messageTimeout = null;
      var timeoutLength = 1500;

      $scope.updateSet = function(si) {
        var s = $scope.lift.sets[si];
        if (s.completed === undefined) {
          s.completed = s.target;
        } else if (s.completed === 0) {
          delete s.completed; // Note: assigning undefined to s.completed causes problems when saving
        } else {
          s.completed--;
        }
        if ($state.includes('user.workout')) {
          clearTimeout(messageTimeout);
          if (isLiftComplete()) {
            if (isLiftSuccess()) {
              messageTimeout = setTimeout(function() {
                $scope.$apply(function() {
                  $scope.success = true;
                  $scope.failure = false;
                });
              }, timeoutLength)
            } else {
              messageTimeout = setTimeout(function() {
                $scope.$apply(function() {
                  $scope.success = false;
                  $scope.failure = true;
                });
              }, timeoutLength)
            }
          }
        }
      };

      $scope.getStyle = function(element) {
        var show = false;
        if (element === 'sets') {
          show = !$scope.success && !$scope.failure;
        } else if (element === 'success') {
          show = $scope.success;
        } else if (element === 'failure') {
          show = $scope.failure;
        }
        return { 'opacity': show ? '1' : '0', 'z-index': show ? '2' : '1' };
      };

      $scope.dismissMessage = function() {
        $scope.success = false;
        $scope.failure = false;
      };

      function isLiftComplete() {
        var complete = true;
        var sets = $scope.lift.sets;
        for (var i = 0; i < sets.length; i++) {
          if (typeof sets[i].completed !== "number") {
            complete = false;
          }
        }
        return complete;
      }

      function isLiftSuccess() {
        var success = true;
        var sets = $scope.lift.sets;
        for (var i = 0; i < sets.length; i++) {
          if (sets[i].completed !== sets[i].target) {
            success = false;
          }
        }
        return success;
      }
    }
  ]
);
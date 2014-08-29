cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.history.details',
        {
          url: '/:year/:month/:day',
          templateUrl: 'partials/history/details.html',
          controller: 'HistoryDetailsController',
          resolve: {
            workouts: ['$stateParams', 'firebase', 'user', function($stateParams, firebase, user) {
              var month = $stateParams.month;
              var day = $stateParams.day;
              month = month < 10 ? '0' + month : month;
              day = day < 10 ? '0' + day : day;
              return user.history[$stateParams.year + month + day];
            }]
          }
        }
      );
    }
  ]
);
cleanlifts.controller('HistoryDetailsController',
  [         '$scope', '$stateParams', '$filter', 'firebase', 'workouts',
    function($scope,   $stateParams,   $filter,   firebase,   workouts) {
      // TODO: move the workout loading logic to resolve statement
      var workout_count = 0;
      for (var id in workouts) {
        if (workouts.hasOwnProperty(id) && workouts[id]) {
          workout_count++;
          loadWorkout(id);
        }
      }

      $scope.details = [];
      function loadWorkout(id) {
        var workout = firebase.sync(['workouts', id]).$asObject();
        workout.$loaded().then(function() {
          $scope.details.push(workout);
        });
      }
      $scope.date = new Date($stateParams.year, $stateParams.month, $stateParams.day);
    }
  ]
);

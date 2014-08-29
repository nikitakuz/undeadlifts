cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.workout.change-date',
        {
          url: '/change-date',
          templateUrl: 'partials/workout/change-date.html',
          controller: 'ChangeDateController',
          resolve: {
            'date': ['firebase', 'user', function(firebase, user) {
              if (!user.current_workout) { return false; }
              return firebase.sync(['workouts', user.current_workout, 'date']).$asObject().$loaded();
            }]
          }
        }
      );
    }
  ]
);
cleanlifts.controller('ChangeDateController',
  [         '$rootScope', '$scope', '$timeout', '$state', '$filter', 'util', 'user', 'workout', 'date',
    function($rootScope,   $scope,   $timeout,   $state,   $filter,   util,   user,   workout,   date) {
      if (!workout) {
        if ($state.includes('user.workout')) {
          $state.transitionTo('user.select-routine', {}, { location: 'replace' });
        } else if ($state.includes('user.history.details')) {
          $state.transitionTo(
            'user.history.month',
            { year: $state.params.year, month: $state.params.month },
            { location: 'replace' }
          );
        }
        return;
      }
      $scope.current_date = util.parseYyyyMmDd(date.$value);
      $scope.selected_date = util.parseYyyyMmDd(date.$value);
      $scope.changeDate = function() {
        if ($scope.selected_date === $scope.current_date) {
          return;
        }
        var newDate = $filter('date')($scope.selected_date, 'yyyyMMdd');
        if ($state.includes('user.history.details')) {
          user.history[newDate] = user.history[date.$value];
          delete user.history[date.$value];
          user.$save().then(function() {
            workout.date = newDate;
            workout.$save().then(function() {
              var date = util.parseYyyyMmDd(newDate);
              $state.transitionTo(
                'user.history.details',
                { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()},
                { replace: true }
              );
            });
          });
        } else if ($state.includes('user.workout')) {
          workout.date = newDate;
          workout.$save().then(function() {
            window.history.back();
            $scope.setDate(newDate);
          });
        }
      };
    }
  ]
);


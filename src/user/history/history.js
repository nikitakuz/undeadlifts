(function() {
  var history = angular.module('undeadlifts.user.history',
    [
      'undeadlifts.user.history.details',
      'undeadlifts.user.history.list',
      'undeadlifts.user.history.month'
    ]
  );

  history.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.history',
          {
            abstract: true,
            url: '/history',
            template: '<div ui-view=""></div>',
            controller: 'AbstractHistoryController',
            resolve: {
              'history': ['firebase', function(firebase) {
                var uid = firebase.getAuth().uid;
                return firebase.sync(['users', uid, 'history']).$asObject().$loaded();
              }]
            }
          }
        );
      }
    ]
  );

  history.constant('MONTH_NAMES', {
    1: 'January', 2: 'February', 3: 'March',      4: 'April',    5: 'May',       6: 'June',
    7: 'July',    8: 'August',   9: 'September', 10: 'October', 11: 'November', 12: 'December'
  });

  history.filter('setsCompleted', function() {
    return function(sets) {
      sets = sets.map(function(set) {
        return set.completed || 0;
      });
      var str = sets.join('/').replace(/-1/g, '0');
      if (str === '5/5/5/5/5') {
        return '5x5';
      } else if (str === '8/8/8') {
        return '3X8';
      } else {
        return str;
      }
    };
  });

  history.filter('shortenLiftName', function() {
    return function(name) {
      if (name === 'Overhead Press') {
        return 'OH Press';
      } else if (name === 'Bench Press') {
        return 'Bench';
      } else if (name === 'Barbell Row') {
        return 'Row';
      } else {
        return name;
      }
    };
  });

  history.controller('AbstractHistoryController',
    [         '$scope', 'history',
      function($scope,   history) {
        history.$bindTo($scope, 'history');

        $scope.$watch('history', function() {
          buildDateToWorkout();
        });

        function buildDateToWorkout() {
          $scope.dateToWorkout = {};
          for (var i in $scope.history) {
            if ($scope.history.hasOwnProperty(i)) {
              var workout = $scope.history[i];
              $scope.dateToWorkout[i] = workout;
            }
          }
        }
      }
    ]
  );
})();

cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.history.list',
        {
          url: '/',
          templateUrl: 'partials/history/list.html',
          controller: 'HistoryListController'
        }
      );
    }
  ]
);
cleanlifts.controller('HistoryListController',
  [         '$scope', '$filter', 'firebase', 'util', 'MONTH_NAMES', 'user',
    function($scope,   $filter,   firebase,   util,   MONTH_NAMES,   user) {
      $scope.now = new Date();

      $scope.getDayOfWeek = function(time) {
        var d = new Date(time).getDay();
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d];
      };

      $scope.history = {};
      for (var date in user.history) {
        if (user.history.hasOwnProperty(date)) {
          var workouts = user.history[date];
          for (var id in workouts) {
            if (workouts.hasOwnProperty(id) && workouts[id]) {
              loadWorkout(id, util.parseYyyyMmDd(date));
            }
          }
        }
      }

      function loadWorkout(id, date) {
        var workout = firebase.sync(['workouts', id]).$asObject();
        var y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
        var h = $scope.history;
        h[y] = h[y] || {};
        h[y].year = y;
        h[y].months = h[y].months || {};
        h[y].months[m] = h[y].months[m] || {};
        h[y].months[m].month = m;
        h[y].months[m].days = h[y].months[m].days || {};
        h[y].months[m].days[d] = h[y].months[m].days[d] || [];
        h[y].months[m].days[d].day = d;
        h[y].months[m].days[d].workouts = h[y].months[m].days[d].workouts || [];
        workout.$loaded().then(function() {
          h[y].months[m].days[d].push(workout);
        });
      }

      $scope.prettyMonth = function(month) {
        return MONTH_NAMES[month];
      };
    }
  ]
);
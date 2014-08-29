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
  [         '$scope', '$filter', 'MONTH_NAMES', 'user',
    function($scope,   $filter,   MONTH_NAMES,   user) {
      $scope.now = new Date();

      $scope.getDayOfWeek = function(time) {
        var d = new Date(time).getDay();
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d];
      };

      $scope.history = {};
      var h = user.history;
      for (var i = 0; i < history.length; i++) {
        for (var j = 0; j < history[i].length; j++) {
          var workout = history[i][j];
          var date = new Date(workout.time);
          var y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
          h[y] = h[y] || {};
          h[y].year = y;
          h[y].months = h[y].months || {};
          h[y].months[m] = h[y].months[m] || {};
          h[y].months[m].month = m;
          h[y].months[m].days = h[y].months[m].days || {};
          h[y].months[m].days[d] = h[y].months[m].days[d] || [];
          h[y].months[m].days[d].day = d;
          h[y].months[m].days[d].workouts = h[y].months[m].days[d].workouts || [];
          h[y].months[m].days[d].push(workout);
        }
      }
      $scope.prettyMonth = function(month) {
        return MONTH_NAMES[month];
      };
    }
  ]
);
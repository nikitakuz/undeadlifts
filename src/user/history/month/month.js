undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.history.month',
        {
          url: '/:year/:month',
          templateUrl: 'user/history/month/month.html',
          controller: 'HistoryMonthController'
        }
      );
    }
  ]
);
undeadlifts.controller('HistoryMonthController',
  [         '$scope', '$stateParams', '$filter', 'MONTH_NAMES',
    function($scope,   $stateParams,   $filter,   MONTH_NAMES) {
      $scope.year = parseInt($stateParams.year);
      $scope.month = parseInt($stateParams.month);
      $scope.month_full_name = MONTH_NAMES[$stateParams.month];
      var MS_IN_DAY = 1000 * 60 * 60 * 24;
      $scope.DAYS_IN_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      function getDates(firstDate, length) {
        var dates = new Array(length);
        dates[0] = firstDate;
        var firstTime = firstDate.getTime();
        for (var i = 1; i < dates.length; i++) {
          dates[i] = new Date(firstTime + i * MS_IN_DAY);
        }
        return dates;
      }

      function getCalendarWeeks(year, month) {
        var firstDayInMonth = new Date(year, month, 1);
        var firstDayOnCalendar = new Date(firstDayInMonth.getTime() - (firstDayInMonth.getDay() * MS_IN_DAY));
        var dates = getDates(firstDayOnCalendar, 42);
        var weeks = new Array(6);
        for (var j = 0; j < weeks.length; j++) {
          weeks[j] = dates.slice(j * 7, j * 7 + 7);
        }
        return weeks;
      }

      $scope.weeks = getCalendarWeeks($scope.year, $scope.month - 1);

      $scope.formatDate = function(format, date) {
//        console.log($filter('date')(date, format));
        return $filter('date')(date, format);
      };

      $scope.dateToWorkout = {};
      for (var i in $scope.history) {
        if ($scope.history.hasOwnProperty(i)) {
          var workout = $scope.history[i];
          $scope.dateToWorkout[i] = workout;
        }
      }
    }
  ]
);
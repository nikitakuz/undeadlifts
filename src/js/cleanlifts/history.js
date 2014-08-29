cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.history',
        {
          abstract: true,
          url: '/history',
          template: '<div ui-view=""></div>',
          controller: 'AbstractHistoryController',
          resolve: {
            'history': ['DataService', function(DataService) {
              return DataService.getHistoryPromise();
            }]
          }
        }
      );
      $stateProvider.state('user.history.list',
        {
          url: '/',
          templateUrl: 'partials/history/list.html',
          controller: 'HistoryListController'
        }
      );
      $stateProvider.state('user.history.month',
        {
          url: '/:year/:month',
          templateUrl: 'partials/history/month.html',
          controller: 'HistoryMonthController'
        }
      );
      $stateProvider.state('user.history.details',
        {
          url: '/:year/:month/:day',
          templateUrl: 'partials/history/details.html',
          controller: 'HistoryDetailsController',
          resolve: {
            details: ['$stateParams', 'DataService', function($stateParams, DataService) {
              return DataService.getHistoryDetailsPromise($stateParams.year, $stateParams.month, $stateParams.day);
            }]
          }
        }
      );
    }
  ]
);
cleanlifts.constant('MONTH_NAMES', {
    1: 'January', 2: 'February', 3: 'March',      4: 'April',    5: 'May',       6: 'June',
    7: 'July',    8: 'August',   9: 'September', 10: 'October', 11: 'November', 12: 'December'
});
cleanlifts.filter('liftsCompleted', function() {
  return function(arr) {
    var str = arr.join('/').replace(/-1/g, '0');
    if (str === '5/5/5/5/5') {
      return '5x5';
    } else if (str === '8/8/8') {
      return '3X8';
    } else {
      return str;
    }
  };
});
cleanlifts.filter('shortenLiftName', function() {
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
cleanlifts.controller('AbstractHistoryController',
  [         '$scope', 'history',
    function($scope,   history) {
      $scope.history = history;

      for (var i = 0; i < history.length; i++) {
        var $id = history[i].$id;
        history[i].date = new Date($id.substr(0, 4), $id.substr(4, 2), $id.substr(6, 2));
      }
    }
  ]
);
cleanlifts.controller('HistoryListController',
  [         '$scope', '$filter', 'MONTH_NAMES', 'history',
    function($scope,   $filter,   MONTH_NAMES,   history) {
      $scope.now = new Date();

      $scope.getDayOfWeek = function(time) {
        var d = new Date(time).getDay();
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d];
      };

      $scope.history = {};
      var h = $scope.history;
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
cleanlifts.controller('HistoryMonthController',
  [         '$scope', '$stateParams', '$filter', 'MONTH_NAMES', 'history',
    function($scope,   $stateParams,   $filter,   MONTH_NAMES,   history) {
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
        console.log($filter('date')(date, format));
        return $filter('date')(date, format);
      };

      $scope.dateToWorkout = {};
      for (var i = 0; i < $scope.history.length; i++) {
        var workout = $scope.history[i];
        $scope.dateToWorkout[workout.$id] = workout;
      }
    }
  ]
);
cleanlifts.controller('HistoryDetailsController',
  [         '$scope', '$stateParams', '$filter', 'history', 'details',
    function($scope,   $stateParams,   $filter,   history,   details) {
      $scope.details = details;
      $scope.date = new Date($stateParams.year, $stateParams.month, $stateParams.day);
    }
  ]
);

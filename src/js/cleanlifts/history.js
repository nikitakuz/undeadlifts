cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.history',
        {
          abstract: true,
          url: '/history',
          templateUrl: 'partials/history.html',
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
  [         '$scope', 'history',
    function($scope,   history) {
    }
  ]
);
cleanlifts.controller('HistoryMonthController',
  [         '$scope', '$stateParams', '$filter', 'history',
    function($scope,   $stateParams,   $filter,   history) {
      $scope.year = parseInt($stateParams.year);
      $scope.month = parseInt($stateParams.month);
      $scope.month_full_name = { 1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August',
        9: 'September', 10: 'October', 11: 'November', 12: 'December' }[$stateParams.month];
      var MS_IN_DAY = 1000 * 60 * 60 * 24;
      $scope.DAYS_IN_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
  [         '$scope', '$filter', 'history', 'details',
    function($scope,   $filter,   history,   details) {
      $scope.details = details;
    }
  ]
);

(function() {
  var history = angular.module('undeadlifts.user.history',
    [
      'ui.router',
      'undeadlifts.user.history.details',
    ]
  );

  history.config(
    [         '$stateProvider',
      function($stateProvider) {
        $stateProvider.state('user.history',
          {
            title: 'History',
            url: '/history/{year:[0-9]{4}}/{month:[0-9]{1,2}}',
            templateUrl: 'user/history/history.html',
            controller: 'HistoryController',
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

  history.controller('HistoryController',
    [         '$rootScope', '$scope', '$state', '$filter', 'firebase', 'util', 'user', 'history', 'MONTH_NAMES',
      function($rootScope,   $scope,   $state,   $filter,   firebase,   util,   user,   history,   MONTH_NAMES) {
        $rootScope.historyView = $rootScope.historyView || 'calendar';
        $rootScope.toggleHistoryViewIcon = $rootScope.historyView === 'calendar' ? 'svg/list.html' : 'svg/calendar.html';
        $rootScope.toggleHistoryView = function() {
          var currentView = $rootScope.historyView;
          $rootScope.historyView = currentView === 'calendar' ? 'list' : 'calendar';
          $rootScope.toggleHistoryViewIcon = currentView === 'calendar' ? 'svg/calendar.html' : 'svg/list.html';
        };

        $scope.now = new Date();
        $scope.year = parseInt($state.params.year);
        $scope.month = parseInt($state.params.month);
        $scope.startOfThisMonth = new Date($scope.year, $scope.month - 1);
        $scope.startOfNextMonth = new Date($scope.year, $scope.month);
        $scope.month_full_name = MONTH_NAMES[$state.params.month];
        $scope.enablePrev = false;
        $scope.enableNext = false;
        var MS_IN_DAY = 1000 * 60 * 60 * 24;
        $scope.DAYS_IN_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
          return $filter('date')(date, format);
        };

        $scope.getDayOfWeek = function(time) {
          var d = new Date(time).getDay();
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d];
        };

        $scope.list = [];
        for (var yyyyMmDd in user.history) {
          var date = util.parseYyyyMmDd(yyyyMmDd);
          if (date.getFullYear() === $scope.year && date.getMonth() + 1 === $scope.month) {
            loadWorkout(yyyyMmDd, date);
          }
          if (date.getTime() < $scope.startOfThisMonth.getTime()) {
            $scope.enablePrev = true;
          }
          if (date.getTime() > $scope.startOfNextMonth.getTime()) {
            $scope.enableNext = true;
          }

        }

        function loadWorkout(yyyyMmDd, date) {
          var wid = user.history[yyyyMmDd];
          var workout = firebase.sync(['workouts', wid]).$asObject();
          $scope.list.push(workout);
          workout.$loaded().then(function() {
            workout.date = date;
          });
        }

        $scope.prettyMonth = function(month) {
          return MONTH_NAMES[month];
        };
      }
    ]
  );
})();

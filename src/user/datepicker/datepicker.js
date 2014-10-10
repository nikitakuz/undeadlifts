(function() {
  var datepicker = angular.module('undeadlifts.datepicker', []);

  datepicker.directive('datepicker',
    [
      function() {
        return {
          restrict: 'E',
          templateUrl: 'user/datepicker/datepicker.html',
          scope: {
            date: '=',
            cancel: '&onCancel',
            submit: '&onSubmit'
          },
          link: function (scope, element, attrs) {
            var MS_IN_DAY = 24 * 60 * 60 * 1000;
            scope.date = new Date(scope.date);
            scope.now = new Date();
            scope.DAYS_IN_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            scope.monthOffset = 0;

            function getDates(firstDate, length) {
              var dates = new Array(length);
              dates[0] = firstDate;
              var firstTime = firstDate.getTime();
              for (var i = 1; i < dates.length; i++) {
                dates[i] = new Date(firstTime + i * MS_IN_DAY);
              }
              return dates;
            }

            function getCalendarWeeks() {
              var year = scope.date.getFullYear(), month = scope.date.getMonth();
              var firstDayInMonth = new Date(year, month, 1);
              var firstDayOnCalendar = new Date(firstDayInMonth.getTime() - (firstDayInMonth.getDay() * MS_IN_DAY));
              var dates = getDates(firstDayOnCalendar, 42);
              var weeks = new Array(6);
              for (var j = 0; j < weeks.length; j++) {
                weeks[j] = dates.slice(j * 7, j * 7 + 7);
              }
              return weeks;
            }

            scope.weeks = getCalendarWeeks();

            scope.$watch('date', function() {
              scope.weeks = getCalendarWeeks();
            }, true);

            scope.prev = function() {
              scope.date.setMonth(scope.date.getMonth() - 1);
            };

            scope.next = function() {
              scope.date.setMonth(scope.date.getMonth() + 1);
            };

            scope.isSameDay = function(date) {
              // Note: Simplifying to following to date.getTime() won't work because of daylight savings time.
              var sameYear = scope.date.getFullYear() === date.getFullYear();
              var sameMonth = scope.date.getMonth() === date.getMonth();
              var sameDate = scope.date.getDate() === date.getDate();
              return sameYear && sameMonth && sameDate;
            };

            scope.setDate = function(date) {
              scope.date = date;
            };
          }
        };
      }
    ]
  );
})();

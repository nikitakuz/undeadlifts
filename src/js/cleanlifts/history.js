cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.history',
        {
          url: '/history',
          templateUrl: 'partials/history.html',
          controller: 'HistoryController',
          resolve: {
            'history': ['DataService', function(DataService) {
              return DataService.getHistoryPromise();
            }]
          }
        }
      );
    }
  ]
);

cleanlifts.controller('HistoryController',
  [         '$scope', 'history',
    function($scope,   history) {
      history.sort(function(a, b) {
        return parseDate(b.date) - parseDate(a.date);
      });
      // set time variable locally for each item so we can apply the date filter.
      for (var i = 0; i < history.length; i++) {
        var date = new Date(history[i].date);
        history[i].time = date.getTime();
      }
      $scope.history = history;

      function parseDate(date) {
        return new Date(date).getTime();
      }
    }
  ]
);
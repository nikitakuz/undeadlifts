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
      $scope.history = history;
    }
  ]
);
cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
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
cleanlifts.controller('HistoryDetailsController',
  [         '$scope', '$stateParams', '$filter', 'details',
    function($scope,   $stateParams,   $filter,  details) {
      $scope.details = details;
      $scope.date = new Date($stateParams.year, $stateParams.month, $stateParams.day);
    }
  ]
);

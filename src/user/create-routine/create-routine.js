undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.create-routine',
        {
          abstract: true,
          url: '/create-routine',
          template: '<div><ui-view class="create-routine"/></div>',
          controller: 'CreateRoutineController'
        }
      );
    }
  ]
);
undeadlifts.controller('CreateRoutineController',
  [         '$scope', 'lifts',
    function($scope, lifts) {
      $scope.selected = [];

      $scope.lifts = lifts.ORDERED;
    }
  ]
);
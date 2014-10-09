undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.create-routine.add-lift',
        {
          url: '/add-lift',
          templateUrl: 'user/create-routine/add-lift/add-lift.html',
          controller: 'AddLiftController'
        }
      );
    }
  ]
);

undeadlifts.controller('AddLiftController',
  [         '$window', '$state', '$scope', 'lifts',
    function($window,   $state,   $scope,   lifts) {
      var BARBELL = lifts.BARBELL;
      var DUMBELL = lifts.DUMBELL;
      var CABLE = lifts.CABLE;
      var OTHER = lifts.OTHER;

      $scope.types = [
        { name: 'All Lifts', type: -1 },
        { name: 'Barbell Lifts', type: BARBELL },
        { name: 'Dumbell Lifts', type: DUMBELL },
        { name: 'Cable Lifts', type: CABLE },
        { name: 'Other', type: OTHER }
      ];

      $scope.type = $scope.types[0];

      $scope.addLift = function(lift) {
        if ($scope.selected.indexOf(lift) === -1) {
          $scope.selected.push(lift);
        }
        if ($window.history && $window.history.back) {
          $window.history.back();
        } else {
          $state.transitionTo('user.create-routine.index', {}, { location: 'replace' });
        }
      };

      $scope.clearSelected = function() {
        $scope.selected = [];
      };

      $scope.isLiftSelectedFilter = function() {
        return function(lift) {
          return $scope.selected.indexOf(lift) === -1;
        };
      };

      $scope.isLiftTypeFilter = function(type) {
        return function(lift) {
          return type.type < 0 || type.type === lift.type;
        };
      };

      console.log('setting position interval');
      var nav = document.getElementById('nav');
      $scope.windowScrollY = 0;
      var positionInterval = setInterval(function() {
        var y = Math.max($window.scrollY - nav.offsetHeight, 0);
        if ($scope.windowScrollY !== y) {
          $scope.$apply(function() {
            $scope.windowScrollY = Math.max($window.scrollY - nav.offsetHeight, 0);
          });
        }
      }, 100);

      $scope.$on('$destroy', function() {
        console.log('clearing position interval');
        clearInterval(positionInterval);
      });
    }
  ]
);
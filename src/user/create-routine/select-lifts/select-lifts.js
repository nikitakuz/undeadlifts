undeadlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.create-routine.select-lifts',
        {
          url: '',
          templateUrl: 'user/create-routine/select-lifts/select-lifts.html',
          controller: 'SelectLiftsController'
        }
      );
    }
  ]
);

undeadlifts.controller('SelectLiftsController',
  [         '$window', '$scope', 'lifts',
    function($window,   $scope,   lifts) {
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

      $scope.selectLift = function(lift) {
        if ($scope.selected.indexOf(lift) > -1) {
          $scope.deselectLift(lift);
          return;
        }
        $scope.selected.push(lift);
      };

      $scope.deselectLift = function(lift) {
        var index = $scope.selected.indexOf(lift);
        $scope.selected.splice(index, 1);
      };

      $scope.clearSelected = function() {
        $scope.selected = [];
      };

      $scope.isLiftSelectedFilter = function() {
        return function(lift) {
          return $scope.selected.indexOf(lift) === -1
        }
      };

      $scope.isLiftTypeFilter = function(type) {
        return function(lift) {
          return type.type < 0 || type.type === lift.type;
        }
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
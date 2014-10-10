(function() {
  var undeadlifts = angular.module('undeadlifts',
    [
      'firebase',
      'ui.router',
      'undeadlifts.constant',
      'undeadlifts.util',
      'undeadlifts.datepicker',
      'undeadlifts.firebase',
      'undeadlifts.login',
      'undeadlifts.signup',
      'undeadlifts.user'
    ]
  );

  undeadlifts.constant('log', function(msg) {
    console.log(msg);
  });

  undeadlifts.run(
    [         '$window', '$rootScope', '$state', '$stateParams',
      function($window,   $rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $state.replace = function(name, params) {
          $state.transitionTo(name, params || {}, {location: 'replace'});
        };

        $state.back = function() {
          var historySupport = $window.history && $window.history.back;

          if (historySupport) {
            $window.history.back();
          } else {
            // TODO: handle special cases. e.g. change-date and change-weight
            $state.go('user.index');
          }
        };

        // The following controls whether the back button will replace the current state with 'user.index' or use history.back()
        $rootScope.initialState = true;
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          if (!fromState.abstract) {
            $rootScope.initialState = false;
          }
        });

        $rootScope.getNumber = function(num) {
          return new Array(Number(parseInt(num)));
        };
      }
    ]
  );

  undeadlifts.directive('focus',
    function() {
      return {
        restrict: 'A',
        scope: { focus: '=focus' },
        link: function(scope, element, attrs) {
          scope.$watch('focus', function(newVal, oldVal) {
            if (scope.focus) {
              element[0].focus();
              element[0].select();
              scope.focus = false;
            }
          });
        }
      };
    }
  );
})();
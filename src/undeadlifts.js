var undeadlifts = angular.module('undeadlifts', ['firebase', 'ui.router']);

(function() {
  var FBURL = 'https://undeadlifts.firebaseio.com';
  var FBREF = new Firebase(FBURL);
  undeadlifts.constant('FBURL', FBURL);
  undeadlifts.constant('FBREF', FBREF);
})();

undeadlifts.constant('log', function(msg) {
  console.log(msg);
});

undeadlifts.run(
  [         '$rootScope', '$state', '$stateParams', 'replaceState',
    function($rootScope,   $state,   $stateParams,   replaceState) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.replaceState = replaceState;

/*
      FBREF.onAuth(function(auth) {
        if (auth && !$state.includes('user')) {
          replaceState('user.index');
        } else if (!auth && $state.includes('user')) {
          replaceState('login');
        }
      });
*/

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
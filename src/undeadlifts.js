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

undeadlifts.service('userService',
  [         'firebase',
    function(firebase) {
      return {
        getUserDataPromise: function(user) {
          firebase.sync(['user', user.uid]);
        }
      };
    }
  ]
);

undeadlifts.run(
  [         '$rootScope', '$state', '$stateParams',
    function($rootScope,   $state,   $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

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
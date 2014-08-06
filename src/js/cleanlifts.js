var cleanlifts = angular.module('cleanlifts', ['firebase', 'ui.router']);

cleanlifts.constant('firebase', new Firebase('https://cleanlifts.firebaseio.com'));

cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    }
  ]
);

cleanlifts.run(
  [         '$rootScope', '$state', '$stateParams', 'auth',
    function($rootScope,   $state,   $stateParams,   auth) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.auth = auth;

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (!$rootScope.user && toState.name !== 'login' && toState.name !== 'signup') {
          event.preventDefault();
        }
      });

      $rootScope.$on('auth.logout', function() {
        // Give state a chance to populate.
        setTimeout(function() {
          var current = $state.current.name;
          if (current !== 'login' && current !== 'signup') {
            $rootScope.$apply(function() {
              $state.transitionTo('login', { b: current }, { location: 'replace' });
            });
          }
        }, 0)
      })
    }
  ]
);

cleanlifts.service('logger',
  [
    function() {
      function log(msg) {
        console.log(msg);
      }

      return {
        log: log
      };
    }
  ]
);

cleanlifts.service('replaceState',
  [         '$state',
    function($state) {
      return function(state, params) {
        $state.transitionTo(state, params || {}, {location: 'replace'});
      }
    }
  ]
)
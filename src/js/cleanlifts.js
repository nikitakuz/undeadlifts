var cleanlifts = angular.module('cleanlifts', ['firebase', 'ui.router']);

(function() {
  var fb = new Firebase('https://cleanlifts.firebaseio.com');
  var fbsl = new FirebaseSimpleLogin(fb, function(error, user) {
    if (error) {
      console.log(error);
    } else if (user) {
      console.log('User logged in. Bootstrapping application...');
      cleanlifts.constant('firebase', new Firebase('https://cleanlifts.firebaseio.com'));
      cleanlifts.constant('user', user);
      angular.element(document).ready(function() {
        angular.bootstrap(document, ['cleanlifts']);
      });
    } else {
      console.log('No user found. Redirecting to login page...');
      var loginUrl = 'login.html?b=' + location.pathname + location.hash;
      if (location.replace) {
        location.replace(loginUrl);
      } else {
        location.href = loginUrl;
      }
    }
  });

  cleanlifts.constant('logout', function() {
    fbsl.logout();
  })
})();



cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider.state('user',
        {
          abstract: true,
          template: '<ui-view/>'
        }
      );
    }
  ]
);

cleanlifts.run(
  [         '$rootScope', '$state', '$stateParams', 'logout',
    function($rootScope,   $state,   $stateParams,   logout) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.logout = logout;
    }
  ]
);

cleanlifts.service('log',
  [
    function() {
      return function(msg) {
        console.log(msg);
      };
    }
  ]
);

cleanlifts.service('replaceState',
  [         '$state',
    function($state) {
      return function(state, params) {
        $state.transitionTo(state, params || {}, {location: 'replace'});
      };
    }
  ]
);
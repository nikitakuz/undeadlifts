var cleanlifts = angular.module('cleanlifts', ['firebase', 'ui.router']);

(function() {
  var log = function(msg) { console.log(msg); };
  var fref = new Firebase('https://cleanlifts.firebaseio.com');
  cleanlifts.constant('log', log );
  cleanlifts.constant('fref', fref);

  var fbsl = new FirebaseSimpleLogin(fref, loginCallback);

  function loginCallback(error, user) {
    if (error) {
      log(error);
    } else if (user) {
      log('User logged in.');
      cleanlifts.constant('user_id', user.uid);
      getUserData(user.uid, function(data) {
        if (!data) {
          log('No user data.');
          setUserData(user, function() {
            bootstrapApplication();
          });
        } else if (user.email !== data.email || user.provider !== data.provider || user.id !== data.provider_id) {
          log('Data exists but incorrect.');
          setUserData(user, function() {
            bootstrapApplication();
          });
        } else {
          log('User data exists and appears to be correct.');
          bootstrapApplication();
        }
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
  }

  function getUserData(uid, callback) {
    log('Fetching user data...');
    var userRef = fref.child('users').child(uid);
    userRef.once('value', function(snapshot) {
      callback(snapshot.val());
    });
  }

  function setUserData(user, callback) {
    log('Creating user data...');
    var userRef = fref.child('users').child(user.uid);
    userRef.set({
      email: user.email,
      provider: user.provider,
      provider_id: user.id
    }, callback);
  }

  function bootstrapApplication() {
    log('Bootstrapping application...');
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['cleanlifts']);
    });
  }

  cleanlifts.constant('logout', function() {
    fbsl.logout();
  });
})();

cleanlifts.service('user',
  [         'fref', 'user_id',
    function(fref, user_id) {
      debugger;
    }
  ]
);

cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider.state('user',
        {
          abstract: true,
          template: '<ui-view/>',
          resolve: {
            user: ['UserService', function(UserService) {
              return UserService.getUser();
            }]
          }
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


cleanlifts.service('replaceState',
  [         '$state',
    function($state) {
      return function(state, params) {
        $state.transitionTo(state, params || {}, {location: 'replace'});
      };
    }
  ]
);
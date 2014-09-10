var cleanlifts = angular.module('cleanlifts', ['firebase', 'ui.router']);

(function() {
  var log = function(msg) { console.log(msg); };
  var FBURL = 'https://cleanlifts.firebaseio.com';
  var FBREF = new Firebase(FBURL);
  cleanlifts.constant('FBURL', FBURL);
  cleanlifts.constant('log', log );
  cleanlifts.constant('FBREF', FBREF);

  var fbsl = new FirebaseSimpleLogin(FBREF, loginCallback);

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
    var userRef = FBREF.child('users').child(uid);
    userRef.once('value', function(snapshot) {
      callback(snapshot.val());
    });
  }

  function setUserData(user, callback) {
    log('Creating user data...');
    var userRef = FBREF.child('users').child(user.uid);
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
  [         'FREF', 'user_id',
    function(FREF, user_id) {
//      debugger;
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
            user: ['firebase', 'user_id', function(firebase, user_id) {
              var user = firebase.sync(['users', user_id]);
              return user.$asObject().$loaded();
            }]
          },
          controller: ['$rootScope', 'user', function($rootScope, user) {
            $rootScope.user = user;
            $rootScope.weight_unit = user.weight_unit;
          }]
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

      $rootScope.getNumber = function(num) {
        return new Array(Number(parseInt(num)));
      };
    }
  ]
);

cleanlifts.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

cleanlifts.service('replaceState',
  [         '$state',
    function($state) {
      return function(state, params) {
        $state.transitionTo(state, params || {}, {location: 'replace'});
      };
    }
  ]
);
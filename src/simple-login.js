undeadlifts.service('simpleLogin',
  [         '$rootScope', 'log', 'state', '$q', 'FBURL',
    function($rootScope,   log,   state,   $q,   FBURL) {
      var simpleLogin = {
        user: null
      };

      var initDeferred = $q.defer();
      var FBREF = new Firebase(FBURL);
      var fbsl = new FirebaseSimpleLogin(FBREF, function(error, user) {
        if (error) {
          log(error);
          $rootScope.$broadcast('simpleLogin.error', error);
        } else if (user) {
          log('User logged in.');
          simpleLogin.user = user;
          $rootScope.$broadcast('simpleLogin.login', error);
        } else {
          log('No user found.');
          simpleLogin.user = null;
          $rootScope.$broadcast('simpleLogin.logout', error);
        }
        initDeferred.resolve(simpleLogin);
      });

      simpleLogin.createUser = function(email, password, callback) {
        fbsl.createUser(email, password, callback);
      };

      simpleLogin.login = function(provider, options) {
        fbsl.login(provider, options);
      };

      simpleLogin.logout = function() {
        fbsl.logout();
      };

      simpleLogin.getInitPromise = function() {
        return initDeferred.promise;
      };

      return simpleLogin;
    }
  ]
);

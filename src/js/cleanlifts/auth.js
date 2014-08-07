cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {

    }
  ]
);

cleanlifts.service('auth',
  [         '$q', '$rootScope', '$state', '$stateParams', 'firebase',
    function($q, $rootScope,   $state,   $stateParams,   firebase) {
      var deferred = $q.defer();

      var user = {};

      var fsl = new FirebaseSimpleLogin(firebase, function(error, user) {
        if (error) {
          console.log(error);
        } else {
          handleLoginSuccess(user);
        }
      });

      function handleLoginSuccess(user) {
        $rootScope.$apply(function() {
          $rootScope.user = user;
        });
        if (user) {
          console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
          firebase.child('users').child(user.uid).set({
            email: user.email,
            provider: user.provider,
            provider_id: user.id
          });
          $rootScope.$broadcast('auth.login');
          deferred.resolve(user);
        } else {
          console.log('user is logged out');
          $rootScope.$broadcast('auth.logout');
          deferred.resolve(user);
        }
      }

      return {
        login: function (email, password) {
          fsl.login('password', { email: email, password: password, rememberMe: true });
        },
        logout: function () {
          fsl.logout();
        },
        createUser: function(email, password, callback) {
          fsl.createUser(email, password, callback);
        },
        getUserPromise: function() {
          return deferred.promise;
        }
      };
    }
  ]
);


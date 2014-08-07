cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {

    }
  ]
);

cleanlifts.service('user',
  [         '$q', '$rootScope', '$state', '$stateParams', 'firebase',
    function($q, $rootScope,   $state,   $stateParams,   firebase) {
      var deferred = $q.defer();
      var resolved = false;

      var currentUser = {};

      var fsl = new FirebaseSimpleLogin(firebase, onAuthChange);

      function onAuthChange(error, user) {
        if (error) {
          console.log(error);
        } else {
          if (user) {
            console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
            firebase.child('users').child(user.uid).set({
              email: user.email,
              provider: user.provider,
              provider_id: user.id
            });
            $rootScope.$broadcast('auth.login');
          } else {
            console.log('user is logged out');
            $rootScope.$broadcast('auth.logout');
          }

          if (!resolved) {
            deferred.resolve(currentUser);
          }
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
        getCurrentUser: function() {
          return deferred.promise;
        }
      };
    }
  ]
);


(function() {
  var firebase = angular.module('undeadlifts.firebase', ['firebase']);

  firebase.service('firebase',
    [         '$q', '$rootScope', '$firebase', '$location', 'FBREF',
      function($q,   $rootScope,   $firebase,   $location,   FBREF) {
        var deferredInit = $q.defer();

        var firebase = {
          getInitPromise: function() {
            return deferredInit.promise;
          },

          ref: function(path) {
            var ref = FBREF;
            path = path instanceof Array ? path : [path];
            for (var i = 0; i < path.length; i++) {
              ref = ref.child(path[i]);
            }
            return ref;
          },

          sync: function(path) {
            var ref = this.ref(path);
            return $firebase(ref);
          },

          push: function(path, val, onComplete) {
            var ref = this.ref(path).push(val, function(err) {
              if (err) {
                onComplete(new Error('Push failed.'), false);
              } else {
                onComplete(false, ref.name());
              }
            });
          },

          authWithPassword: function(credentials, onComplete) {
            return FBREF.authWithPassword(credentials, onComplete);
          },

          authWithFacebook: function(onComplete) {
/*
            FBREF.authWithOAuthPopup('facebook', function(error, authData) {
              if (!error) {
                onComplete(error, authData);
              } else if (error.code === 'TRANSPORT_UNAVAILABLE') {
*/
                FBREF.authWithOAuthRedirect('facebook', onComplete);
/*
              } else {
                alert(error.code);
              }
            });
*/
          },

          getAuth: function() {
            return FBREF.getAuth();
          },

          unauth: function() {
            return FBREF.unauth();
          },

          createUser: function(credentials, onComplete) {
            return FBREF.createUser(credentials, onComplete);
          }
        };

        FBREF.onAuth(function(auth) {
//          $rootScope.alert('onAuth() callback: (auth === null) = ' + (auth === null));
          deferredInit.resolve(firebase);
        });

        return firebase;
      }
    ]
  );
})();
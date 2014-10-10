(function() {
  // mock firebase for unit testing purposes.
  var firebase = angular.module('undeadlifts.firebase', ['firebase']);

  firebase.service('firebase',
    [  '$q', '$firebase', 'FBREF',
      function($q, $firebase, FBREF) {
        var deferredInit = $q.defer();

        var mockFirebase = {
          auth: null,

          getInitPromise: function () {
            return this;
//            return deferredInit.promise;
          },

          ref: function (path) {
            var ref = FBREF;
            path = path instanceof Array ? path : [path];
            for (var i = 0; i < path.length; i++) {
              ref = ref.child(path[i]);
            }
            return ref;
          },


          sync: function (path) {
            if (path[0] === 'users') {
              return {
                $asObject: function() {
                  return {
                    $loaded: function() {
                      debugger;
                    }
                  }
                }
              }
            }
            var ref = this.ref(path);
            return $firebase(ref);
          },

          authWithPassword: function(credentials, onComplete) {
            this.auth = {uid: 'fubar'};
            onComplete(null, this.auth);
          },

          getAuth: function () {
            return this.auth;
          },

          setAuth: function (auth) {
            this.auth = auth;
          }
        };

        deferredInit.resolve(mockFirebase);

        return mockFirebase
      }
    ]
  );
})();

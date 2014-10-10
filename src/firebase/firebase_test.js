(function() {
/*
  undeadlifts.service('firebase',
    [  '$q', '$firebase', 'FBREF',
      function($q, $firebase, FBREF) {
        var deferredInit = $q.defer();

        var mockFirebase = {
          auth: null,

          getInitPromise: function () {
            return deferredInit.promise;
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
            var ref = this.ref(path);
            return $firebase(ref);
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
*/
})();

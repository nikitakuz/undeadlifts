(function() {
  // mock firebase for unit testing purposes.
  var firebase = angular.module('undeadlifts.firebase', ['firebase']);

  var mockData = {
    'users': {
      'fubar': {
        // blank user
      }
    }
  };

  firebase.service('firebase',
    [  '$q', '$firebase', 'FBREF',
      function($q, $firebase, FBREF) {
        var mockFirebase = {
          auth: null,

          getInitPromise: function () {
            return this;
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
            var value = null;
            path = path instanceof Array ? path : [path];

            debugger;

            for (var i = 0; i < path.length; i++) {
              value = value ? value[path[i]] : mockData[path[i]];
            }

            return {
              $asObject: $asObject,
              $asArray: $asArray
            };

            function $asObject() {
              return {
                $loaded: function() {
                  return value;
                }
              }
            }

            function $asArray() {
              return {
                $loaded: function() {
                  return value;
                }
              }
            }
          },

          authWithPassword: function(credentials, onComplete) {
            this.auth = {uid: 'fubar'};
            onComplete(null, this.auth);
          },

          getAuth: function () {
            return this.auth;
          }
        };

        return mockFirebase
      }
    ]
  );
})();

cleanlifts.service('UserService',
  [         '$firebase', 'fref', 'user_id',
    function($firebase,   fref,   user_id) {
      var user = fref.child('users').child(user_id);
      var routines = user.child('routines');

      return {
        getUser: function() {
          return objectPromise(user);
        },

        getRoutines: function() {
          return arrayPromise(routines);
        },

        getRoutine: function(id) {
          return objectPromise(routines.child(id))
        }
      };

      function objectPromise(ref) {
        return $firebase(ref).$asObject().$loaded();
      }

      function arrayPromise(ref) {
        return $firebase(ref).$asArray().$loaded();
      }
    }
  ]
);
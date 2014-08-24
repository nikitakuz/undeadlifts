cleanlifts.service('DataService',
  [         '$firebase', 'fref', 'user_id',
    function($firebase,   fref,   user_id) {
      var user = fref.child('users').child(user_id);
      var routines = user.child('routines');
      var history = user.child('history');

      return {
        getUserPromise: function() {
          return objectPromise(user);
        },

        getRoutinesPromise: function() {
          return arrayPromise(routines);
        },

        getHistoryPromise: function() {
          return arrayPromise(history);
        },

        getHistoryDetailsPromise: function(year, month, day) {
          month = month < 10 ? '0' + month : month;
          day = day < 10 ? '0' + day : day;
          return objectPromise(history.child('' + year + month + day));
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
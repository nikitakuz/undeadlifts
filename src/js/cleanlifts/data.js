cleanlifts.service('DataService',
  [         '$firebase', 'FBREF', 'user_id',
    function($firebase,   FBREF,   user_id) {
      var user = FBREF.child('users').child(user_id);
      var workout = FBREF.child('workout');
      var routines = user.child('routines');
      var history = user.child('history');

      return {
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
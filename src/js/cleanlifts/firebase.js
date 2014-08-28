cleanlifts.service('firebase',
  [         '$firebase', 'FBREF',
    function($firebase,   FBREF) {
      return {
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
        }
      }
    }
  ]
);
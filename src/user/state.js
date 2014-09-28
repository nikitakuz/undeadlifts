undeadlifts.service('state',
  [         '$window', '$rootScope', '$state', '$timeout',
    function($window,   $rootScope,   $state,   $timeout) {
      var state = {
        next: function(name, params) {
          $state.go(name, params);
        },

        prev: function() {
          var name = $state.current.name.split('.');
          name.pop();
          name = name.join('.');
          $state.transitionTo(name, {}, {location: 'replace'});
        },

        replace: function(name, params) {
          $state.transitionTo(name, params || {}, {location: 'replace'});
        }
      };

      var hash = window.location.hash;
      if (hash !== '/#') {
        var current = $state.current;
        state.replace('user.index');
        $timeout(function() {
          state.next(current.name, current.params);
        });
      }

      return state;
    }
  ]
);
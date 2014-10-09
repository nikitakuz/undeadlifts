undeadlifts.service('state',
  [         '$window', '$rootScope', '$state', '$timeout',
    function($window,   $rootScope,   $state,   $timeout) {
      // To preserve the ability of the nav home button to navigate to 'user.index' via window.history.back():
      // If the initial state is not 'user.index', replace current state with 'user.index' and then go to desired state.
/*
      $timeout(function() {
        var hash = window.location.hash;
        if (hash !== '/#') {
          var name = $state.current.name;
          var params = $state.params;
          replace('user.index');
          $timeout(function() {
            $state.go(name, params);
          });
        }
      });
*/
      return {
        currentName: function() {
          return $state.current.name;
        },
        includes: function(name) {
          return $state.includes(name);
        },
        is: function(name) {
          return $state.is(name);
        }
      };
    }
  ]
);
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

      function replace(name, params) {
        $state.transitionTo(name, params || {}, {location: 'replace'});
      }

      function back(fallbackName, fallbackParams) {
        if ($window.history && $window.history.back) {
          $window.history.back();
        } else {
          this.replace(fallbackName || getParent($state.current.name), fallbackParams || $state.params);
        }
      }

      function getParent(name) {
        var split = name.split('.');
        if (split.length > 2) {
          split.pop();
          return split.join('.');
        } else {
          return 'user.index';
        }
      }

      return {
        replace: replace,
        back: back,
        includes: function(name) {
          return $state.includes(name);
        }
      };
    }
  ]
);
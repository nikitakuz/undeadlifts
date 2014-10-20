(function() {
  var decorators = angular.module('undeadlifts.state-decorator',
    [
      'ui.router'
    ]
  );

  decorators.config(
    [         '$provide',
      function($provide) {
        $provide.decorator('$state',
          [         '$delegate', '$window',
            function($delegate,   $window) {
              $delegate.replace = function(name, params) {
                $delegate.transitionTo(name, params || {}, {location: 'replace'});
              };

              $delegate.replaceWithLogin = function() {
                var back = (window.location.hash || '').replace('#', '');
                var params = back === '/' ? {} : {b: back};
                $delegate.replace('login', params);
              };

              $delegate.back = function() {
                var historySupport = $window.history && $window.history.back;

                if (historySupport) {
                  $window.history.back();
                } else {
                  // TODO: handle special cases. e.g. change-date and change-weight
                  $delegate.go('user.index');
                }
              };

              return $delegate;
            }
          ]
        );
      }
    ]
  );
})();

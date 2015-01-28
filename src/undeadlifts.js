(function() {
  var undeadlifts = angular.module('undeadlifts',
    [
      'ngSanitize',
      'monospaced.elastic',
      'firebase',
      'ui.router',
      'ui.bootstrap',
      'undeadlifts.constant',
      'undeadlifts.state-decorator',
      'undeadlifts.templates',
      'undeadlifts.util',
      'undeadlifts.datepicker',
      'undeadlifts.firebase',
      'undeadlifts.login',
      'undeadlifts.signup',
      'undeadlifts.user'
    ]
  );

  undeadlifts.constant('log', function(msg) {
    console.log(msg);
  });

  undeadlifts.run(
    [         '$window', '$rootScope', '$state', '$stateParams', '$timeout',
      function($window,   $rootScope,   $state,   $stateParams,   $timeout) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.appInitialized = false;
        $timeout(function() {
          $rootScope.appInitialized = true;
        }, 1);

        // The following controls whether the back button will replace the current state with 'user.index' or use history.back()
        $rootScope.initialState = true;
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          if (!fromState.abstract) {
            $rootScope.initialState = false;
          }
        });


        // Alert Modal
        $rootScope.alertModal = {
          show: false,
          message: '',
          clear: function() {
            this.show = false;
            this.message = '';
          }
        };

        $rootScope.alert = function(message) {
          $rootScope.alertModal.show = true;
          $rootScope.alertModal.message = message;
        };


        // Confirm Modal
        $rootScope.confirmModal = {
          show: false,
          message: '',
          clear: function() {
            this.show = false;
            this.message = '';
            this.cancelText = '';
            this.confirmText = '';
          }
        };

        $rootScope.confirm = function(options) {
          $rootScope.confirmModal.show = true;
          $rootScope.confirmModal.message = options.message || 'Are you sure?';
          $rootScope.confirmModal.cancelText = options.cancelText || 'Cancel';
          $rootScope.confirmModal.confirmText = options.confirmText || 'Confirm';
          $rootScope.confirmModal.confirmCallbackAndClear = function() {
            options.confirmCallback();
            $rootScope.confirmModal.clear();
          }
        };

        $rootScope.getNumber = function(num) {
          return new Array(Number(parseInt(num)));
        };
      }
    ]
  );

  undeadlifts.directive('focus',
    function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var focus = attrs.focus; // the value to watch on the scope
          var split = focus.split('.'); // may be a nested value
          scope.$watch(attrs.focus, function(newVal, oldVal) {
            if (newVal) {
              element[0].focus();
              element[0].select();
              // find the (nested) value in the scope and set to false
              var object = scope;
              for (var i = 0; i < split.length; i++) {
                if (i < split.length - 1) {
                  object = object[split[i]];
                } else {
                  object[split[i]] = false;
                }
              }
            }
          });
        }
      };
    }
  );

  undeadlifts.directive('blurOnEnter',
    function() {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          element.on('keypress', function(e) {
            if (e.charCode === 13) {
              element[0].blur();
            }
          });
        }
      };
    }
  );
})();
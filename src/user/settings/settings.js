cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.settings',
        {
          url: '/settings',
          templateUrl: 'user/settings/settings.html',
          controller: 'UserSettingsController'
        }
      );
    }
  ]
);
cleanlifts.controller('UserSettingsController',
  [         '$scope',
    function($scope) {
      $scope.setting_ids = ['auto-increment', 'rest-timer-sound'];

      $scope.settings = {
        'auto-increment': {
          name: 'Auto Increment Weight', type: 'boolean', default: true,
          note: 'If you get all your reps for a lift, the weight will be increased on the next workout.'
        },
        'rest-timer-sound': {
          name: 'Rest Timer Sound', type: 'boolean', default: true,
          note: 'Note: Rest timer sound will not play in background in IOS devices.'
        }
      };

      $scope.user.settings = $scope.user.settings || {};

      for (var i in $scope.settings) {
        if ($scope.settings.hasOwnProperty(i) && !$scope.user.settings.hasOwnProperty(i)) {
          $scope.user.settings[i] = $scope.settings[i].default;
          $scope.user.$save();
        }
      }

      $scope.toggleBooleanSetting = function(id) {
        if (typeof $scope.user.settings[id] === 'boolean') {
          $scope.user.settings[id] = !$scope.user.settings[id];
          $scope.user.$save();
        }
      };
    }
  ]
);
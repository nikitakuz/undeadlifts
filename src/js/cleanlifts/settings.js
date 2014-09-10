cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $stateProvider.state('user.settings',
        {
          url: '/settings',
          templateUrl: 'partials/settings.html',
          controller: 'UserSettingsController'
        }
      );
    }
  ]
);
cleanlifts.controller('UserSettingsController',
  [         '$scope', 'user',
    function($scope,   user) {
      debugger;
    }
  ]
);
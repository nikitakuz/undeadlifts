var cleanlifts = angular.module('cleanlifts', ['firebase', 'ui.router']);

cleanlifts.constant('firebase', new Firebase('https://cleanlifts.firebaseio.com'));

cleanlifts.config(
  [         '$stateProvider', '$urlRouterProvider',
    function($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    }
  ]
);

cleanlifts.run(function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});

cleanlifts.service('logger',
  [
    function() {
      function log(msg) {
        console.log(msg);
      }

      return {
        log: log
      };
    }
  ]
);
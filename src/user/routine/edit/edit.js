(function() {
  var edit = angular.module('undeadlifts.user.routine.edit',
    [
      'ui.router'
    ]
  );

  edit.config(
    [         '$stateProvider',
      function ($stateProvider) {
        $stateProvider.state('user.routine.edit',
          {
            url: '/routine/edit/:id',
            templateUrl: 'user/routine/routine.html',
            controller: 'EditRoutineController',
            resolve: {
              routine: ['$stateParams', 'auth', 'firebase', function($stateParams, auth, firebase) {
                return firebase.sync(['users', auth.uid, 'routines', $stateParams.id]).$asObject().$loaded();
              }]
            }
          }
        );
      }
    ]
  );

  edit.controller('EditRoutineController',
    [         '$window', '$state', '$scope', 'user', 'routine',
      function($window, $state, $scope, user, routine) {
        $scope.routine = routine;

        $scope.updateRoutine = function() {
          var results = $scope.validateRoutine($scope.routine);
          if (results.valid) {
            $scope.routine.$save();
          }
        }
      }
    ]
  );
})();

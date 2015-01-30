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
            title: 'Edit Routine',
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

        $scope.nav.menuItems = [ {
          text: 'Delete Routine',
          callback: function() {
            $scope.confirm({
              message:
                '<div>Are you sure you want to delete this routine?</div>',
              cancelText: 'Cancel',
              confirmText: 'Delete',
              confirmCallback: function() {
                $scope.routine.$remove().then(function(ref) {
                  $state.transitionTo('user.routine.list', {}, {});
                }, function(err) {
                  $scope.alert(err);
                });
              }
            });
          }
        } ];

        $scope.updateRoutine = function() {
          var results = $scope.validateRoutine($scope.routine);
          if (results.valid) {
            $scope.routine.$save();
          }
        };
      }
    ]
  );
})();

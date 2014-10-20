describe('undeadlifts.user.create-routine', function() {
  beforeEach(module('undeadlifts.user.create-routine'));

  var $window, $state, $controller, liftService;
  var $scope = {
    alert: function() {}
  };

  var user = {
    routines: [
      {
        name: 'My Routine'
      }
    ],
    $save: function() {}
  };

  beforeEach(inject(function(_$window_, _$state_, _$controller_, _liftService_) {
    $window = _$window_;
    $state = _$state_;
    $controller = _$controller_;
    liftService = _liftService_;

    $controller('AbstractCreateRoutineController', {$state: $state, $scope: $scope, liftService: liftService, user: user});

    spyOn(user, '$save');
    spyOn($state, 'replace');
    spyOn($scope, 'alert');
  }));

  describe('if a routine doesn\'t have a name', function() {
    it('createRoutine() shouldn\'t call user.$save()', function() {
      $scope.createRoutine();
      expect(user.$save).not.toHaveBeenCalled();
    });
  });

  describe('if a routine has a unique name but no lifts are selected', function() {
    it('createRoutine() shouldn\'t call user.$save()', function() {
      $scope.routine.name = 'Unique Name';
      $scope.createRoutine();
      expect(user.$save).not.toHaveBeenCalled();
    });
  });

  describe('if a routine with the same name already exists', function() {
    it('createRoutine() should call $scope.alert() and shouldn\'t call user.$save()', function() {
      $scope.routine.name = user.routines[0].name;
      $scope.selected = [{name: 'Test Lift', sets: 1, reps: 1}];
      $scope.createRoutine();
      expect($scope.alert).toHaveBeenCalledWith('A routine with the this name already exists.');
      expect(user.$save).not.toHaveBeenCalled();
    });
  });

  describe('if a routine has a unique name but and at least one lift is selected', function() {
    it('createRoutine() should call user.$save() and the state should be replaced with user.select-routine', function() {
      $scope.routine.name = 'Unique Name';
      $scope.selected = [{name: 'Test Lift', sets: 1, reps: 1}];
      $scope.createRoutine();
      expect(user.$save).toHaveBeenCalled();
      expect($state.replace).toHaveBeenCalledWith('user.select-routine');
    });
  });
});

describe('undeadlifts.user.routines.create', function() {
  beforeEach(module('undeadlifts.user.routines.create'));

  var $state, $controller, LIFTS, SQUAT, ARNOLD_PRESS;
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

  beforeEach(inject(function(_$state_, _$controller_, _LIFTS_) {
    $state = _$state_;
    $controller = _$controller_;
    LIFTS = _LIFTS_;
    SQUAT = LIFTS.BARBELL.LIFTS[0];
    ARNOLD_PRESS = LIFTS.DUMBBELL.LIFTS[0];

    $controller('CreateRoutineController', {$scope: $scope, user: user});

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
      $scope.addLift(SQUAT);
      $scope.createRoutine();
      expect($scope.alert).toHaveBeenCalledWith('A routine with the this name already exists.');
      expect(user.$save).not.toHaveBeenCalled();
    });
  });

  describe('if a routine has a unique name but and at least one lift is selected', function() {
    it('createRoutine() should call user.$save() and the state should be replaced with user.select-routine', function() {
      $scope.routine.name = 'Unique Name';
      $scope.addLift(SQUAT);
      $scope.createRoutine();
      expect(user.$save).toHaveBeenCalled();
      expect($state.replace).toHaveBeenCalledWith('user.select-routine');
    });
  });

  describe('if a lift is already selected', function() {
    it('shouldn\'t be possible to select it again', function() {
      $scope.routine.name = 'Unique Name';
      $scope.addLift(SQUAT);
      $scope.addLift(ARNOLD_PRESS);
      $scope.addLift(SQUAT);
      $scope.addLift(ARNOLD_PRESS);
      expect($scope.selected.length).toEqual(2);
    });
  });

  describe('selected lifts', function() {
    it('should have type defined', function() {
      $scope.addLift(SQUAT);
      expect($scope.selected[0].type).toEqual('Barbell');
      $scope.addLift(ARNOLD_PRESS);
      expect($scope.selected[1].type).toEqual('Dumbbell');
    });
  });
});

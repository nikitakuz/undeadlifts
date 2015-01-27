describe('undeadlifts.user', function() {
  beforeEach(module('undeadlifts.user'));

  describe('if there is no user', function() {
    it('user.index state should transition to login state.', inject(function($rootScope, $state) {
        $state.go('user.index');
        $rootScope.$digest();
        expect($state.current.name).toEqual('login');
      }
    ));
  });

  describe('if there is a user', function() {
    describe('user should be able to navigate to', function() {
      testState('user.index');
      testState('user.routine');
      testState('user.routine.create');
      testState('user.routine.select');
      testState('user.history', {year: 2014, month: 10});
      testState('user.settings');
    });

    function testState(name, params) {
      var should =  name + (params ? '(' + JSON.stringify(params) + ')' : '');
      it(should, inject(function($rootScope, $state, firebase) {
        firebase.authWithPassword({foo: 'bar'}, function() {});
        $state.go(name, params);
        $rootScope.$digest();
        expect($state.current.name).toEqual(name);
      }));
    }
  });
});
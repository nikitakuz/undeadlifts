describe('undeadlifts.user', function() {
  beforeEach(module('undeadlifts'));

  describe('if there is no user', function() {
    it('user.index state should transition to login state.', inject(function($rootScope, $state, firebase) {
        $state.go('user.index');
        $rootScope.$digest();
        expect($state.current.name).toEqual('login');
      }
    ));
  });
});